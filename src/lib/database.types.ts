export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string | null
                    phone: string | null
                    full_name: string
                    avatar_url: string | null
                    user_type: "student" | "professional" | "mentor"
                    onboarding_completed: boolean
                    subscription_status: "free" | "trial" | "premium" | "cancelled"
                    subscription_expires_at: string | null
                    created_at: string
                    updated_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id: string
                    email?: string | null
                    phone?: string | null
                    full_name: string
                    avatar_url?: string | null
                    user_type?: "student" | "professional" | "mentor"
                    onboarding_completed?: boolean
                    subscription_status?: "free" | "trial" | "premium" | "cancelled"
                    subscription_expires_at?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: string
                    email?: string | null
                    phone?: string | null
                    full_name?: string
                    avatar_url?: string | null
                    user_type?: "student" | "professional" | "mentor"
                    onboarding_completed?: boolean
                    subscription_status?: "free" | "trial" | "premium" | "cancelled"
                    subscription_expires_at?: string | null
                    created_at?: string
                    updated_at?: string
                    deleted_at?: string | null
                }
            }
            user_profiles: {
                Row: {
                    id: string
                    user_id: string
                    date_of_birth: string | null
                    gender: "male" | "female" | "other" | "prefer_not_to_say" | null
                    country: string | null
                    city: string | null
                    education_level: "high_school" | "undergraduate" | "graduate" | "postgraduate" | "other" | null
                    current_institution: string | null
                    field_of_study: string | null
                    interests: Json
                    bio: string | null
                    linkedin_url: string | null
                    twitter_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date_of_birth?: string | null
                    gender?: "male" | "female" | "other" | "prefer_not_to_say" | null
                    country?: string | null
                    city?: string | null
                    education_level?: "high_school" | "undergraduate" | "graduate" | "postgraduate" | "other" | null
                    current_institution?: string | null
                    field_of_study?: string | null
                    interests?: Json
                    bio?: string | null
                    linkedin_url?: string | null
                    twitter_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date_of_birth?: string | null
                    gender?: "male" | "female" | "other" | "prefer_not_to_say" | null
                    country?: string | null
                    city?: string | null
                    education_level?: "high_school" | "undergraduate" | "graduate" | "postgraduate" | "other" | null
                    current_institution?: string | null
                    field_of_study?: string | null
                    interests?: Json
                    bio?: string | null
                    linkedin_url?: string | null
                    twitter_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            careers: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string
                    overview: string | null
                    category: string
                    subcategory: string | null
                    salary_range_min: number | null
                    salary_range_max: number | null
                    salary_currency: string
                    job_outlook: string | null
                    work_environment: string | null
                    typical_tasks: Json
                    personality_fit: Json
                    education_requirements: Json
                    certification_requirements: Json
                    is_active: boolean
                    created_at: string
                    updated_at: string
                    created_by: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description: string
                    overview?: string | null
                    category: string
                    subcategory?: string | null
                    salary_range_min?: number | null
                    salary_range_max?: number | null
                    salary_currency?: string
                    job_outlook?: string | null
                    work_environment?: string | null
                    typical_tasks?: Json
                    personality_fit?: Json
                    education_requirements?: Json
                    certification_requirements?: Json
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string
                    overview?: string | null
                    category?: string
                    subcategory?: string | null
                    salary_range_min?: number | null
                    salary_range_max?: number | null
                    salary_currency?: string
                    job_outlook?: string | null
                    work_environment?: string | null
                    typical_tasks?: Json
                    personality_fit?: Json
                    education_requirements?: Json
                    certification_requirements?: Json
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                    created_by?: string | null
                }
            }
            mentors: {
                Row: {
                    id: string
                    user_id: string
                    professional_title: string
                    company: string | null
                    years_of_experience: number
                    bio: string
                    expertise_areas: Json
                    languages: Json
                    hourly_rate: number
                    currency: string
                    availability: Json
                    session_duration: number
                    max_sessions_per_week: number
                    rating: number
                    total_sessions: number
                    total_reviews: number
                    status: "pending" | "approved" | "rejected" | "suspended"
                    approved_by: string | null
                    approved_at: string | null
                    rejection_reason: string | null
                    certificates: Json
                    linkedin_url: string | null
                    portfolio_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    professional_title: string
                    company?: string | null
                    years_of_experience: number
                    bio: string
                    expertise_areas?: Json
                    languages?: Json
                    hourly_rate: number
                    currency?: string
                    availability?: Json
                    session_duration?: number
                    max_sessions_per_week?: number
                    rating?: number
                    total_sessions?: number
                    total_reviews?: number
                    status?: "pending" | "approved" | "rejected" | "suspended"
                    approved_by?: string | null
                    approved_at?: string | null
                    rejection_reason?: string | null
                    certificates?: Json
                    linkedin_url?: string | null
                    portfolio_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    professional_title?: string
                    company?: string | null
                    years_of_experience?: number
                    bio?: string
                    expertise_areas?: Json
                    languages?: Json
                    hourly_rate?: number
                    currency?: string
                    availability?: Json
                    session_duration?: number
                    max_sessions_per_week?: number
                    rating?: number
                    total_sessions?: number
                    total_reviews?: number
                    status?: "pending" | "approved" | "rejected" | "suspended"
                    approved_by?: string | null
                    approved_at?: string | null
                    rejection_reason?: string | null
                    certificates?: Json
                    linkedin_url?: string | null
                    portfolio_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            // Add more table types as needed
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
