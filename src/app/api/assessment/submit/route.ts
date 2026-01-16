
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
        const { scores, responses } = body;

        if (!scores || !responses) {
            return NextResponse.json(
                { error: "Missing required fields: scores or responses" },
                { status: 400 }
            );
        }

        // 1. Check for AI Caching: Have they submitted these exact answers before?
        // We use JSON.stringify for a simple deep comparison in the query if possible, 
        // but better to fetch and compare or use a hash. For now, simple lookup.
        const { data: existingAssessment } = await supabase
            .from("personality_assessments")
            .select("id, traits")
            .eq("user_id", user.id)
            .eq("responses", responses)
            .not("traits", "is", null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (existingAssessment) {
            console.log("AI Cache Hit: Reusing existing assessment", existingAssessment.id);
            return NextResponse.json({
                success: true,
                assessmentId: existingAssessment.id,
                cached: true
            });
        }

        // 2. No cache hit. Check credits.
        let { data: dbUser, error: userError } = await supabase
            .from("users")
            .select("credits")
            .eq("id", user.id)
            .single();

        if (userError || !dbUser) {
            // Auto-create user record if missing (safety net for failed triggers)
            const { data: newUser, error: createError } = await supabase
                .from("users")
                .insert({
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || "User",
                    credits: 10 // Give initial credits if missing
                })
                .select("credits")
                .single();

            if (createError) {
                console.error("Failed to auto-create user:", createError);
                return NextResponse.json({ error: "User profile could not be initialized" }, { status: 500 });
            }
            dbUser = newUser;
        }

        if (dbUser.credits < 1) {
            return NextResponse.json({
                error: "Insufficient credits",
                code: "INSUFFICIENT_CREDITS"
            }, { status: 402 });
        }

        // 3. Deduct credit
        const { error: deductError } = await supabase
            .from("users")
            .update({ credits: dbUser.credits - 1 })
            .eq("id", user.id);

        if (deductError) {
            throw new Error("Failed to deduct credit");
        }

        // 4. Save new assessment data
        const { data: assessment, error: dbError } = await supabase
            .from("personality_assessments")
            .insert({
                user_id: user.id,
                assessment_type: "riasec",
                responses,
                scores,
                traits: {}, // Will be populated by AI
                ai_analysis: "Pending analysis...",
            })
            .select()
            .single();

        if (dbError) {
            console.error("Database error:", dbError);
            // ROLLBACK credit? In a real system, use a transaction. 
            // For now, logged.
            return NextResponse.json(
                { error: "Failed to save assessment", details: dbError },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, assessmentId: assessment.id });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
