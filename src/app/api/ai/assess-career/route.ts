import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiClient } from "@/lib/ai/client";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 1. Fetch User Profile & Data
        const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        // 2. Fetch User Skills (if any)
        const { data: userSkills } = await supabase
            .from("user_skills")
            .select("*, skills(name)")
            .eq("user_id", user.id);

        // 3. Construct Context for AI
        const analysisContext = {
            education_level: profile.education_level,
            field_of_study: profile.field_of_study,
            current_institution: profile.current_institution,
            interests: profile.interests,
            bio: profile.bio,
            skills: userSkills?.map(us => us.skills?.name) || [],
        };

        // 4. Call AI Service
        const analysis = await aiClient.analyzeCareerProfile(analysisContext);

        // 5. Save Recommendations to Database
        // Note: We'll store the raw JSON for now, but ideally we'd link to 'careers' table
        // For MVP, we just return the analysis to the frontend

        // Optional: Save to 'career_recommendations' table logic here

        return NextResponse.json(analysis);

    } catch (error: any) {
        console.error("Career Analysis API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
