"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Coins, Zap, Shield, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const PLANS = [
    {
        id: "starter",
        name: "Starter",
        credits: 5,
        price: 500,
        description: "Perfect for a single comprehensive assessment.",
        features: [
            "5 AI Credits",
            "Detailed Career Analysis",
            "Personality Insights",
            "Basic Roadmap"
        ],
        popular: false,
        buttonText: "Get 5 Credits"
    },
    {
        id: "pro",
        name: "Professional",
        credits: 15,
        price: 1200,
        description: "Explore multiple career paths with deeper insights.",
        features: [
            "15 AI Credits",
            "Priority AI Analysis",
            "PDF Report Downloads",
            "Advanced Career Map",
            "Skill Gap Analysis"
        ],
        popular: true,
        buttonText: "Get 15 Credits"
    },
    {
        id: "enterprise",
        name: "Ambition",
        credits: 50,
        price: 3500,
        description: "Unlimited guidance for long-term career planning.",
        features: [
            "50 AI Credits",
            "Everything in Pro",
            "Early Access Features",
            "Mentor Session Discount",
            "Unlimited Re-assessments"
        ],
        popular: false,
        buttonText: "Get 50 Credits"
    }
];

export default function PricingPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ title: string; message: string; type: "success" | "error" } | null>(null);
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, [supabase]);

    const handlePayment = (plan: typeof PLANS[0]) => {
        if (!user) {
            setNotification({
                title: "Authentication Required",
                message: "Please log in to purchase credits.",
                type: "error"
            });
            setTimeout(() => router.push("/login"), 2000);
            return;
        }

        setLoading(plan.id);

        // PaystackPop is loaded via Script tag below
        // @ts-ignore
        const handler = PaystackPop.setup({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
            email: user.email,
            amount: plan.price * 100, // Paystack expects amount in cents/kobo
            currency: "KES",
            ref: `TAL-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
            metadata: {
                custom_fields: [
                    {
                        display_name: "Plan Name",
                        variable_name: "plan_name",
                        value: plan.name
                    },
                    {
                        display_name: "Credits",
                        variable_name: "credits",
                        value: plan.credits
                    },
                    {
                        display_name: "User ID",
                        variable_name: "user_id",
                        value: user.id
                    }
                ]
            },
            callback: async function (response: any) {
                // Verify payment on the server
                try {
                    const res = await fetch("/api/payments/verify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            reference: response.reference,
                            planId: plan.id,
                            credits: plan.credits,
                            amount: plan.price
                        }),
                    });

                    const data = await res.json();

                    if (data.success) {
                        setNotification({
                            title: "Payment Successful!",
                            message: `Added ${plan.credits} credits to your account.`,
                            type: "success"
                        });
                        setTimeout(() => {
                            router.refresh();
                            router.push("/dashboard");
                        }, 2000);
                    } else {
                        throw new Error(data.error || "Verification failed");
                    }
                } catch (error: any) {
                    setNotification({
                        title: "Verification Failed",
                        message: error.message || "We couldn't verify your payment. Please contact support.",
                        type: "error"
                    });
                } finally {
                    setLoading(null);
                }
            },
            onClose: function () {
                setLoading(null);
                setNotification({
                    title: "Payment Cancelled",
                    message: "The payment process was closed.",
                    type: "error"
                });
                setTimeout(() => setNotification(null), 3000);
            },
        });

        handler.openIframe();
    };

    return (
        <div className="relative space-y-12 pb-12 overflow-x-hidden">
            <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

            {/* Custom Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-[100] p-4 rounded-2xl shadow-2xl border flex items-start gap-4 animate-in slide-in-from-top-full duration-300 max-w-sm ${notification.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-900" : "bg-red-50 border-red-100 text-red-900"
                    }`}>
                    {notification.type === "success" ? <Shield className="h-5 w-5 mt-0.5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />}
                    <div className="flex-1">
                        <h4 className="font-black text-sm uppercase tracking-tight">{notification.title}</h4>
                        <p className="text-xs font-medium opacity-80">{notification.message}</p>
                    </div>
                    <button onClick={() => setNotification(null)} className="opacity-50 hover:opacity-100">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            <div className="text-center space-y-4 pt-8">
                <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent italic">
                    Fuel Your Career Journey
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                    Top up your AI credits and unlock deeper insights into your professional potential.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {PLANS.map((plan) => (
                    <Card
                        key={plan.id}
                        className={`relative border-none shadow-2xl rounded-[2rem] overflow-hidden transition-all hover:scale-[1.02] flex flex-col ${plan.popular ? 'bg-primary text-white scale-105 z-10' : 'bg-white'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 right-0 bg-white text-primary font-black py-1 px-4 rounded-bl-2xl text-[10px] uppercase tracking-[0.2em] shadow-md">
                                Most Popular
                            </div>
                        )}
                        <CardHeader className="p-8 pb-4">
                            <div className={`p-3 rounded-2xl w-fit mb-4 ${plan.popular ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                                <Coins className="h-6 w-6" />
                            </div>
                            <CardTitle className="text-2xl font-black italic">{plan.name}</CardTitle>
                            <CardDescription className={plan.popular ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                                {plan.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 flex-1">
                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-70">KES</span>
                                <span className="text-5xl font-black">{plan.price}</span>
                            </div>
                            <div className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`h-5 w-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-white/20' : 'bg-primary/10'}`}>
                                            <Check className={`h-3 w-3 ${plan.popular ? 'text-white' : 'text-primary'}`} />
                                        </div>
                                        <span className="text-sm font-semibold">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="p-8 pt-4">
                            <Button
                                onClick={() => handlePayment(plan)}
                                disabled={loading !== null}
                                className={`w-full h-12 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${plan.popular
                                    ? 'bg-white text-primary hover:bg-white/90 shadow-xl'
                                    : 'bg-primary text-white hover:bg-primary/90 shadow-lg'
                                    }`}
                            >
                                {loading === plan.id ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        {plan.buttonText}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Refund & Security Notice */}
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left pt-12">
                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-3xl shadow-xl shadow-slate-200/50">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Shield className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-tight">Secure Checkout</h3>
                        <p className="text-xs text-muted-foreground font-medium">Encrypted transactions via Paystack.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-6 rounded-3xl shadow-xl shadow-slate-200/50">
                    <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-sm uppercase tracking-tight">Instant Credit</h3>
                        <p className="text-xs text-muted-foreground font-medium">Credits added to your account immediately.</p>
                    </div>
                </div>
            </div>
            <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] pb-12">
                Terms of Service & Privacy Policy Apply
            </p>
        </div>
    );
}
