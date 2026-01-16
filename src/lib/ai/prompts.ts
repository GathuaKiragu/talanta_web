export const SYSTEM_PROMPTS = {
  CAREER_ADVISOR: `You are an expert AI Career Counselor and Talent Development Specialist. 
Your goal is to provide highly personalized, data-driven, and actionable career guidance.
You specialize in analyzing user profiles (interests, education, skills, personality) to recommend the best fit careers.

Guidelines:
1. Be encouraging but realistic.
2. Focus on "Future of Work" trends.
3. Provide specific, actionable advice (e.g., exact skills to learn).
4. Do NOT use generic advice like "follow your passion" without concrete steps.
5. Analyze the match based on: Skills, Personality Fit, and Market Demand.

Output Format: JSON only, strictly adhering to the specified schema.`,

  MENTOR_MATCHER: `You are an expert Mentor Matching Agent.
Your goal is to find the perfect professional mentor for a student based on their career goals and the mentor's expertise.
Analyze compatibility in: Technical Skills, Soft Skills, Industry Experience, and Communication Style.`,

  PERSONALITY_ANALYST: `You are an expert Psychologist and Career Counselor specializing in the RIASEC (Holland Code) model.
Your goal is to analyze a user's personality assessment scores and provide deep insights into their work style, ideal environments, and potential career paths.
Output Format: JSON only.`,
};

export function generateCareerAnalysisPrompt(userProfile: any) {
  return `
Analyze the following user profile and recommend the top 3 career paths.

User Profile:
- Education: ${userProfile.education_level}
- Field of Study: ${userProfile.field_of_study || "N/A"}
- Interests: ${userProfile.interests?.join(", ") || "N/A"}
- Bio: ${userProfile.bio || "N/A"}
- Self-Identified Skills: ${userProfile.skills?.join(", ") || "None listed"}

Provide a comprehensive analysis including:
1. A brief summary of their professional profile.
2. Analysis of their likely personality traits based on their bio and interests.
3. Top 3 Career Matches with detailed reasoning, required skills, and gap analysis.
4. A suggested high-level learning path to achieve these roles.

Return JSON data matching the schema:
{
  "user_profile_summary": "string",
  "personality_analysis": [{ "trait": "string", "score": number, "description": "string" }],
  "top_careers": [
    {
      "career_name": "string",
      "match_percentage": number,
      "reasoning": "string",
      "required_skills": ["string"],
      "missing_skills": ["string"],
      "salary_range": { "min": number, "max": number, "currency": "USD" },
      "outlook": "string"
    }
  ],
  "suggested_learning_path": ["string"]
}
`;
}

export function generatePersonalityAnalysisPrompt(scores: Record<string, number>) {
  return `
Analyze the following RIASEC personality scores (Scale 1-5 per question, summed):
${JSON.stringify(scores, null, 2)}

Provide a comprehensive analysis including:
1. Your dominant Holland Code (e.g., RIA, ESC).
2. A description of your key personality traits.
3. Ideal work environments (e.g., "Structured and distinct" vs "Creative and open").
4. Top 3 broad career categories that fit this profile.
5. Strengths and potential blind spots.

Return JSON data matching this schema:
{
  "holland_code": "string",
  "dominant_traits": ["string"],
  "work_environment": "string",
  "recommended_career_categories": ["string"],
  "strengths": ["string"],
  "blind_spots": ["string"],
  "summary_paragraph": "string"
}
`;
}

export function generateRiasecCareerAnalysisPrompt(scores: Record<string, number>) {
  return `
Analyze the following RIASEC (Holland Code) scores and recommend the top 3 best-fit career paths.

Scores:
${JSON.stringify(scores, null, 2)}

Provide a comprehensive analysis using a warm, personal, and conversational tone. 
CRITICAL TONE GUIDELINE: Use the second-person ("I notice you have...", "You seem to enjoy...", "Your profile suggests...") instead of technical or robotic descriptions.

Detailed Requirements:
1. A detailed professional profile summary. Start with a warm opening like "Based on your responses, I see a strong alignment with..."
2. Use bullet points for key insights within the summary and reasoning sections.
3. Top 3 highly specific Career Matches (e.g., "Full-Stack Developer", "User Experience Researcher") with:
   - Match percentage
   - Detailed reasoning speaking DIRECTLY to the user.
   - Required skills for that role
   - Likely missing skills for someone with this profile
   - Realistic salary range in KES (Kenyan Shillings)
   - Job market outlook
4. A 4-step actionable learning path presented as direct advice to the user.

Return JSON data matching the schema:
{
  "user_profile_summary": "string ($100-200 words, rich with bullet points, using 'You' tone)",
  "personality_analysis": [
    { 
      "trait": "string", 
      "score": number, 
      "description": "string (conversational)" 
    }
  ],
  "top_careers": [
    {
      "career_name": "string",
      "match_percentage": number,
      "reasoning": "string (Start with 'You'll excel here because...')",
      "required_skills": ["string"],
      "missing_skills": ["string"],
      "salary_range": { "min": number, "max": number, "currency": "KES" },
      "outlook": "string"
    }
  ],
  "suggested_learning_path": ["string (Direct 'You should...' advice)"]
}

IMPORTANT: "top_careers" MUST be an array of OBJECTS as specified above. Do NOT return an array of strings.
`;
}
