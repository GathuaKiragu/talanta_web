import { z } from "zod";

const publicSchema = z.object({
    // Application
    NEXT_PUBLIC_APP_URL: z.string().url().optional(), // Made optional for dev
    NEXT_PUBLIC_APP_NAME: z.string().default("Career Guidance Platform"),

    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

    // Paystack
    NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: z.string().startsWith("pk_").optional(),
});

const privateSchema = z.object({
    // Environment
    NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),

    // Supabase
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(), // Made optional to prevent dev crash if not using admin features

    // Paystack
    PAYSTACK_SECRET_KEY: z.string().startsWith("sk_").optional(),
    PAYSTACK_WEBHOOK_SECRET: z.string().optional(),

    // AI Service
    AI_MODEL_ENDPOINT: z.string().url().optional(),
    AI_MODEL_API_KEY: z.string().optional(),
    AI_MODEL_NAME: z.string().default("deepseek-r1"),
    AI_MODEL_TEMPERATURE: z.string().default("0.7"),
    AI_MODEL_MAX_TOKENS: z.string().default("2000"),

    // SMS Provider
    SMS_PROVIDER: z.enum(["twilio", "africastalking"]).default("twilio"),
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_PHONE_NUMBER: z.string().optional(),
    AFRICASTALKING_API_KEY: z.string().optional(),
    AFRICASTALKING_USERNAME: z.string().optional(),

    // Email Provider
    EMAIL_PROVIDER: z.enum(["resend", "sendgrid"]).default("resend"),
    RESEND_API_KEY: z.string().optional(),
    SENDGRID_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().email().optional(),

    // Redis (optional)
    REDIS_URL: z.string().url().optional(),

    // Feature Flags
    FEATURE_AI_RECOMMENDATIONS: z.string().default("true"),
    FEATURE_MENTOR_BOOKING: z.string().default("true"),
    FEATURE_PREMIUM_CONTENT: z.string().default("true"),
    FEATURE_ADMIN_PANEL: z.string().default("true"),
});

function validateEnv() {
    // Check if we are on the client
    const isClient = typeof window !== "undefined";

    // Combine schemas based on environment
    // On client, we only care about public vars.
    // On server, we want both, but we merge them carefully.

    // safeParse is used to prevent crashing immediately
    const processEnv = {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
        PAYSTACK_WEBHOOK_SECRET: process.env.PAYSTACK_WEBHOOK_SECRET,
        AI_MODEL_ENDPOINT: process.env.AI_MODEL_ENDPOINT,
        AI_MODEL_API_KEY: process.env.AI_MODEL_API_KEY,
        AI_MODEL_NAME: process.env.AI_MODEL_NAME,
        AI_MODEL_TEMPERATURE: process.env.AI_MODEL_TEMPERATURE,
        AI_MODEL_MAX_TOKENS: process.env.AI_MODEL_MAX_TOKENS,
        SMS_PROVIDER: process.env.SMS_PROVIDER,
        TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
        TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
        AFRICASTALKING_API_KEY: process.env.AFRICASTALKING_API_KEY,
        AFRICASTALKING_USERNAME: process.env.AFRICASTALKING_USERNAME,
        EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        EMAIL_FROM: process.env.EMAIL_FROM,
        REDIS_URL: process.env.REDIS_URL,
        FEATURE_AI_RECOMMENDATIONS: process.env.FEATURE_AI_RECOMMENDATIONS,
        FEATURE_MENTOR_BOOKING: process.env.FEATURE_MENTOR_BOOKING,
        FEATURE_PREMIUM_CONTENT: process.env.FEATURE_PREMIUM_CONTENT,
        FEATURE_ADMIN_PANEL: process.env.FEATURE_ADMIN_PANEL,
    };

    // On client, only validate properly exposed variables
    if (isClient) {
        const parsed = publicSchema.safeParse(processEnv);
        if (!parsed.success) {
            console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
            // Return defaults or empty to keep app running (or throw if critical)
            // Only throw if critical vars are missing
            if (process.env.NODE_ENV !== 'production') {
                console.warn("Client environment validation failed, using fallbacks where possible.");
            }
            return processEnv as any;
        }
        return parsed.data;
    }

    // Server source
    const mergedSchema = publicSchema.merge(privateSchema);
    const parsed = mergedSchema.safeParse(processEnv);

    if (!parsed.success) {
        console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
        // Only throw if strictly necessary, or provide a way to bypass
        if (process.env.NODE_ENV !== 'production') {
            console.warn("Server environment validation failed. Check your .env file.");
            // Return what we have to allow easy debugging instead of crash loop
            return processEnv as any;
        }
        throw new Error("Invalid environment variables");
    }

    return parsed.data;
}

export const env = validateEnv();

// Helper to check feature flags
export const features = {
    aiRecommendations: env.FEATURE_AI_RECOMMENDATIONS === "true",
    mentorBooking: env.FEATURE_MENTOR_BOOKING === "true",
    premiumContent: env.FEATURE_PREMIUM_CONTENT === "true",
    adminPanel: env.FEATURE_ADMIN_PANEL === "true",
};
