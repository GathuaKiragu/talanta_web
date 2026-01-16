import { z } from "zod";

export const PersonalityTraitSchema = z.object({
    trait: z.string(),
    score: z.number().min(0).max(100),
    description: z.string(),
});

export const CareerMatchSchema = z.object({
    career_name: z.string(),
    match_percentage: z.number().min(0).max(100),
    reasoning: z.string(),
    required_skills: z.array(z.string()),
    missing_skills: z.array(z.string()),
    salary_range: z.object({
        min: z.number(),
        max: z.number(),
        currency: z.string().default("USD"),
    }),
    outlook: z.string(),
});

export const CareerAnalysisSchema = z.object({
    user_profile_summary: z.string(),
    personality_analysis: z.array(PersonalityTraitSchema),
    top_careers: z.array(CareerMatchSchema),
    suggested_learning_path: z.array(z.string()),
});

export type CareerAnalysis = z.infer<typeof CareerAnalysisSchema>;
export type PersonalityTrait = z.infer<typeof PersonalityTraitSchema>;

export const DetailedPersonalityAnalysisSchema = z.object({
    holland_code: z.string(),
    dominant_traits: z.array(z.string()),
    work_environment: z.string(),
    recommended_career_categories: z.array(z.string()),
    strengths: z.array(z.string()),
    blind_spots: z.array(z.string()),
    summary_paragraph: z.string(),
});

export type DetailedPersonalityAnalysis = z.infer<typeof DetailedPersonalityAnalysisSchema>;

