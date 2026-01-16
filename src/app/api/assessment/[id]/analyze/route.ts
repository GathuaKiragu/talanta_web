
import { createClient } from "@/lib/supabase/server";
import { aiClient } from "@/lib/ai/client";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Fetch the assessment
        const { data: assessment, error: dbError } = await supabase
            .from("personality_assessments")
            .select("*")
            .eq("id", id)
            .single();

        if (dbError || !assessment) {
            return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
        }

        // 2. Check if analysis already exists to avoid redundant AI calls
        if (assessment.traits && Object.keys(assessment.traits).length > 0) {
            return NextResponse.json({
                success: true,
                analysis: assessment.traits
            });
        }

        // 3. Trigger AI Analysis
        const analysis = await aiClient.analyzeCareerFromRiasec(assessment.scores);

        // 4. Update assessment with AI results
        const { error: updateError } = await supabase
            .from("personality_assessments")
            .update({
                ai_analysis: analysis.user_profile_summary,
                traits: analysis,
            })
            .eq("id", id);

        if (updateError) {
            console.error("Failed to update assessment with AI results:", updateError);
            return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 });
        }

        return NextResponse.json({ success: true, analysis });

    } catch (error: any) {
        console.error("Analysis API Fatal Error:", {
            message: error.message,
            stack: error.stack,
            id: id
        });
        return NextResponse.json(
            {
                error: "Internal Server Error",
                details: error.message,
                hint: error.message.includes("AI Service Error") ? "AI Service is currently unreachable or returned an error." : "An unexpected error occurred in our analysis engine."
            },
            { status: 500 }
        );
    }
}
