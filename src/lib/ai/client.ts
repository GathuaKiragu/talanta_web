import { env } from "@/lib/env";
import { CareerAnalysisSchema, DetailedPersonalityAnalysisSchema, type CareerAnalysis, type DetailedPersonalityAnalysis } from "./types";
import { SYSTEM_PROMPTS, generatePersonalityAnalysisPrompt } from "./prompts";

export class AIClient {
    private apiKey: string;
    private endpoint: string;
    private model: string;

    constructor() {
        this.apiKey = env.AI_MODEL_API_KEY;
        this.endpoint = env.AI_MODEL_ENDPOINT; // e.g., https://api.deepseek.com/v1/chat/completions
        this.model = env.AI_MODEL_NAME;
    }

    private async fetchCompletion(messages: any[]) {
        try {
            const response = await fetch(this.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: parseFloat(env.AI_MODEL_TEMPERATURE),
                    max_tokens: parseInt(env.AI_MODEL_MAX_TOKENS),
                    response_format: { type: "json_object" }, // Ensure JSON output if supported
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`AI Service Error (${response.status}): ${errorText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("AI Client Error:", error);
            throw error;
        }
    }

    private async parseJsonResponse(rawResponse: string) {
        if (!rawResponse) {
            console.error("AI Client: Received empty or null rawResponse");
            throw new Error("Invalid AI response format: Received empty content from AI service.");
        }

        // More robust JSON extraction for models that might include markdown or reasoning tags
        let jsonStr = rawResponse;

        // 1. Remove markdown code blocks if present
        jsonStr = jsonStr.replace(/```json\n?|\n?```/g, "").trim();

        // 2. Extract content between first { and last } if it still looks like it contains extra text
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
        }

        try {
            return JSON.parse(jsonStr);
        } catch (e: any) {
            console.error("AI Client JSON Parse Failed:", {
                error: e.message,
                originalResponse: rawResponse.substring(0, 500) + (rawResponse.length > 500 ? "..." : ""),
                cleanedString: jsonStr.substring(0, 500) + (jsonStr.length > 500 ? "..." : "")
            });
            throw new Error(`Invalid AI response format: ${e.message}. See server logs for raw response.`);
        }
    }

    async analyzeCareerProfile(userProfile: any): Promise<CareerAnalysis> {
        const prompt = `
      ${SYSTEM_PROMPTS.CAREER_ADVISOR}
      
      Analyze the following user profile and return a JSON object:
      ${JSON.stringify(userProfile, null, 2)}
      
      Required JSON Structure:
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

        const messages = [
            { role: "system", content: SYSTEM_PROMPTS.CAREER_ADVISOR },
            { role: "user", content: prompt },
        ];

        const rawResponse = await this.fetchCompletion(messages);
        const parsedData = await this.parseJsonResponse(rawResponse);
        return CareerAnalysisSchema.parse(parsedData);
    }
    async analyzePersonality(scores: Record<string, number>): Promise<DetailedPersonalityAnalysis> {
        const prompt = generatePersonalityAnalysisPrompt(scores);

        const messages = [
            { role: "system", content: SYSTEM_PROMPTS.PERSONALITY_ANALYST },
            { role: "user", content: prompt },
        ];

        const rawResponse = await this.fetchCompletion(messages);
        const parsedData = await this.parseJsonResponse(rawResponse);
        return DetailedPersonalityAnalysisSchema.parse(parsedData);
    }

    async analyzeCareerFromRiasec(scores: Record<string, number>): Promise<CareerAnalysis> {
        const { generateRiasecCareerAnalysisPrompt } = await import("./prompts");
        const prompt = generateRiasecCareerAnalysisPrompt(scores);

        const messages = [
            { role: "system", content: SYSTEM_PROMPTS.CAREER_ADVISOR },
            { role: "user", content: prompt },
        ];

        const rawResponse = await this.fetchCompletion(messages);

        const parsedData = await this.parseJsonResponse(rawResponse);

        // Validate with Zod
        try {
            return CareerAnalysisSchema.parse(parsedData);
        } catch (e: any) {
            console.error("AI Analysis Zod Validation Failed:", {
                error: e.errors,
                data: parsedData
            });
            throw new Error(`Data validation failed: ${e.message}`);
        }
    }

    async generateJson(prompt: string, systemContext: string = SYSTEM_PROMPTS.CAREER_ADVISOR): Promise<any> {
        const messages = [
            { role: "system", content: systemContext },
            { role: "user", content: prompt },
        ];

        const rawResponse = await this.fetchCompletion(messages);
        return await this.parseJsonResponse(rawResponse);
    }
}

export const aiClient = new AIClient();
