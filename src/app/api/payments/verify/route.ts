import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
    try {
        const { reference, planId, credits, amount } = await request.json();

        if (!reference) {
            return NextResponse.json({ success: false, error: "Missing reference" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Verify with Paystack
        const paystackSecret = env.PAYSTACK_SECRET_KEY;
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${paystackSecret}`,
            },
        });

        const data = await response.json();

        if (data.status && data.data.status === "success") {
            // Payment is valid
            // 1. Update user credits
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("credits")
                .eq("id", user.id)
                .single();

            if (userError) throw userError;

            const newCredits = (userData?.credits || 0) + credits;

            const { error: updateError } = await supabase
                .from("users")
                .update({ credits: newCredits })
                .eq("id", user.id);

            if (updateError) throw updateError;

            // 2. Create payment record
            const { error: paymentError } = await supabase
                .from("payments")
                .insert({
                    user_id: user.id,
                    amount: amount,
                    currency: "KES",
                    status: "completed",
                    provider_reference: reference,
                    payment_type: "credits",
                    metadata: {
                        plan_id: planId,
                        credits: credits,
                        paystack_data: data.data
                    }
                });

            if (paymentError) {
                console.error("Failed to create payment record:", paymentError);
                // We don't throw here because the user at least got their credits
            }

            return NextResponse.json({ success: true, newCredits });
        } else {
            return NextResponse.json({
                success: false,
                error: data.message || "Payment verification failed"
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Internal server error"
        }, { status: 500 });
    }
}
