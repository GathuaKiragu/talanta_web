const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'web/.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
    console.log("Checking User Profile...");
    const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .ilike('full_name', '%Kiragu%');

    if (userError) console.error("User Error:", userError);
    else console.log("Users Found:", JSON.stringify(users, null, 2));

    if (users && users.length > 0) {
        const userId = users[0].id;

        console.log("\nChecking User Profile Data...");
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId);

        if (profileError) console.error("Profile Error:", profileError);
        else console.log("Profile Data:", JSON.stringify(profile, null, 2));

        console.log("\nChecking Latest Assessments...");
        const { data: assessments, error: assessError } = await supabase
            .from('personality_assessments')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(3);

        if (assessError) console.error("Assessment Error:", assessError);
        else console.log("Latest Assessments:", JSON.stringify(assessments.map(a => ({
            id: a.id,
            created_at: a.created_at,
            traits_keys: a.traits ? Object.keys(a.traits) : null,
            top_match: a.traits?.top_careers?.[0]?.career_name
        })), null, 2));

        console.log("\nInspecting Specific Assessment 893ae73f-e98a-4dc6-b41e-5945a527bd03...");
        const { data: specAssess, error: specError } = await supabase
            .from('personality_assessments')
            .select('*')
            .eq('id', '893ae73f-e98a-4dc6-b41e-5945a527bd03')
            .single();

        if (specError) console.error("Spec Error:", specError);
        else {
            console.log("Spec Assessment Traits:", JSON.stringify(specAssess.traits, null, 2));
            console.log("Spec Assessment AI Analysis:", specAssess.ai_analysis);

            console.log("\nAttempting AI Analysis for this assessment...");
            try {
                // Mocking scores if they look like RIASEC
                const scores = specAssess.scores;
                console.log("Scores used for analysis:", JSON.stringify(scores, null, 2));

                // We need to import AIClient logic or just fetch manually
                const endpoint = process.env.AI_MODEL_ENDPOINT;
                const apiKey = process.env.AI_MODEL_API_KEY;
                const model = process.env.AI_MODEL_NAME;

                console.log(`Endpoint: ${endpoint}, Model: ${model}`);

                const prompt = `Analyze these RIASEC scores: ${JSON.stringify(scores)}. Return a JSON object with user_profile_summary and top_careers.`;

                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: "system", content: "You are a career advisor. Return JSON." },
                            { role: "user", content: prompt }
                        ],
                        response_format: { type: "json_object" }
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("AI Response Received!");
                    console.log("Content:", data.choices[0].message.content);
                } else {
                    console.error("AI Service Error:", response.status, await response.text());
                }
            } catch (e) {
                console.error("AI Test Error:", e);
            }
        }
    }
}

debug();
