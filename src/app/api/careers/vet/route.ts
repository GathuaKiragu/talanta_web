import { createClient } from "@/lib/supabase/server";
import { aiClient } from "@/lib/ai/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { careerName, assessmentId } = body;

        if (!careerName || !assessmentId) {
            return NextResponse.json(
                { error: "Missing required fields: careerName or assessmentId" },
                { status: 400 }
            );
        }

        // 1. Fetch the assessment
        const { data: assessment, error: dbError } = await supabase
            .from("personality_assessments")
            .select("scores, traits")
            .eq("id", assessmentId)
            .eq("user_id", user.id)
            .single();

        if (dbError || !assessment) {
            return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
        }

        // 2. Fetch user profile for context (optional but good)
        const { data: profile } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

        // 3. Use AI to vet the career
        const prompt = `
            Analyze how well the career "${careerName}" matches this RIASEC profile:
            Scores: ${JSON.stringify(assessment.scores)}
            
            User Context:
            - Bio: ${profile?.bio || "N/A"}
            - Interests: ${profile?.interests?.join(", ") || "N/A"}
            
            Provide a detailed vetting analysis in JSON format:
            {
                "alignment_score": number (0-100),
                "reasoning": "string (Direct 'You' tone, explain why it fits or doesn't)",
                "recommended_skills": ["string"],
                "market_outlook": "string",
                "salary_kes": { "min": number, "max": number }
            }
        `;

        const vetting = await aiClient.generateJson(prompt, "Career Vetting Specialist");

        return NextResponse.json({ success: true, vetting });

    } catch (error: any) {
        console.error("Vetting API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
