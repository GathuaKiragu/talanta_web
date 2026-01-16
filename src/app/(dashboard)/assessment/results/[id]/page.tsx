"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Briefcase, GraduationCap, TrendingUp, User, DollarSign, Target, Brain, Sparkles, Clock, ArrowRight } from "lucide-react";
import { type CareerAnalysis } from "@/lib/ai/types";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { generateCareerReportPDF } from "@/lib/utils/pdf-generator";
import { Download, Lock } from "lucide-react";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    Tooltip
} from "recharts";

export default function AssessmentResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const [data, setData] = useState<CareerAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [subscriptionType, setSubscriptionType] = useState<string>("free");
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        let pollInterval: NodeJS.Timeout;

        async function fetchAssessment() {
            try {
                // First, check if results already exist in DB
                const { data: assessment, error: dbError } = await supabase
                    .from("personality_assessments")
                    .select("*")
                    .eq("id", resolvedParams.id)
                    .single();

                if (dbError) throw dbError;
                if (!assessment) throw new Error("Assessment not found");

                // Check user subscription status
                const { data: userProfile } = await supabase
                    .from("users")
                    .select("subscription_type")
                    .eq("id", assessment.user_id)
                    .single();

                if (userProfile) setSubscriptionType(userProfile.subscription_type);

                const traits = assessment.traits as unknown as CareerAnalysis;
                if (traits && Object.keys(traits).length > 0) {
                    setData(traits);
                    setLoading(false);
                    return;
                }

                // If no traits, we need to trigger/check analysis via the background API
                const analysisResponse = await fetch(`/api/assessment/${resolvedParams.id}/analyze`, {
                    method: "POST"
                });

                const analysisData = await analysisResponse.json();

                if (analysisResponse.ok && analysisData.analysis) {
                    setData(analysisData.analysis);
                    setLoading(false);
                } else if (analysisData.error === "Analysis still pending") {
                    setError("Analysis still pending");
                    setLoading(false);
                    // Start polling
                    pollInterval = setInterval(fetchAssessment, 5000);
                } else {
                    throw new Error(analysisData.error || "Failed to fetch analysis");
                }

            } catch (err: any) {
                console.error("Error fetching assessment:", err);
                setError(err.message);

                // Fallback to local storage for immediate post-test view
                const stored = localStorage.getItem("latest_career_analysis");
                if (stored && stored !== "undefined") {
                    try {
                        setData(JSON.parse(stored));
                    } catch (e) {
                        console.error("Failed to parse stored analysis:", e);
                        localStorage.removeItem("latest_career_analysis");
                    }
                }
                setLoading(false);
            }
        }

        fetchAssessment();

        return () => {
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [resolvedParams.id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary animate-bounce">
                <Brain className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold">Assembling Your Future...</h2>
            <p className="text-muted-foreground animate-pulse max-w-sm">Our AI is crunching your numbers to find the most aligned career paths for you.</p>
        </div>
    );

    if (error === "Analysis still pending" && !data) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
            <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">AI Analysis in Progress</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    We're still generating your personalized career roadmap. This usually takes 10-15 seconds. Hang tight!
                </p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl px-8 h-12 font-bold group">
                Check Status <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1" />
            </Button>
        </div>
    );

    if (error && !data) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
            <div className="h-20 w-20 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                <Brain className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold">Oops! Could not find results</h2>
            <p className="text-muted-foreground max-w-md">We couldn't retrieve this specific assessment. It might have been deleted or the link is invalid.</p>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="mt-4">Back to Dashboard</Button>
        </div>
    );

    if (!data) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20">
            {/* Hero Header */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12">
                    <Sparkles className="h-64 w-64" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-4">
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/10 -ml-4 rounded-full px-4"
                            onClick={() => router.push("/dashboard")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Journey
                        </Button>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                            Your Career Journey <br />
                            <span className="text-white/80">is now in focus.</span>
                        </h1>
                        <div className="flex items-center gap-4 text-white/80 font-medium">
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm">
                                <Clock className="h-4 w-4" /> AI Analysis Complete
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm">
                                <Sparkles className="h-4 w-4" /> 98% Confidence
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <Button
                            variant="secondary"
                            disabled={subscriptionType === 'free' || isGeneratingPDF}
                            onClick={async () => {
                                setIsGeneratingPDF(true);
                                try {
                                    await generateCareerReportPDF(data, "assessment-report-content");
                                } catch (e) {
                                    console.error("PDF Error:", e);
                                    alert("Failed to generate PDF. Please try again.");
                                }
                                setIsGeneratingPDF(false);
                            }}
                            className="bg-white/20 hover:bg-white/30 text-white border-white/20 rounded-2xl h-12 font-bold shadow-lg shadow-black/10 backdrop-blur-sm group w-full"
                        >
                            {isGeneratingPDF ? (
                                <><Brain className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                            ) : subscriptionType === 'free' ? (
                                <><Lock className="mr-2 h-4 w-4" /> Download PDF (Premium)</>
                            ) : (
                                <><Download className="mr-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" /> Download Report</>
                            )}
                        </Button>
                        {subscriptionType === 'free' && (
                            <Link href="/pricing" className="text-[10px] text-white/60 hover:text-white text-center underline underline-offset-4">
                                Upgrade to unlock PDF reports
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div id="assessment-report-content" className="space-y-10">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Summary */}
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-white to-slate-50 relative">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 text-primary">
                                    <User className="h-5 w-5" />
                                    <CardTitle className="text-xl font-bold">The Real You</CardTitle>
                                </div>
                                <CardDescription className="text-base">AI assessment of your professional identity</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <p className="leading-relaxed text-slate-700 text-lg">
                                    {data.user_profile_summary}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Top Matches */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                                    <Briefcase className="h-6 w-6 text-orange-600" />
                                </div>
                                Top Career Matches
                            </h2>

                            <div className="grid gap-6">
                                {data.top_careers.map((career, index) => (
                                    <Card key={index} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all group rounded-3xl">
                                        <div className="h-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 w-full" style={{ width: `${career.match_percentage}%` }} />
                                        <CardHeader className="p-8 pb-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-2xl font-black group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-300">
                                                        {career.career_name}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-sm">
                                                            {career.match_percentage}% Match
                                                        </span>
                                                        <span className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                                                            <TrendingUp className="h-4 w-4 text-green-500" /> {career.outlook}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right hidden sm:block">
                                                    <div className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-1">Estimated Annual</div>
                                                    <div className="text-xl font-black text-slate-900">
                                                        {formatCurrency(career.salary_range.min).replace('.00', '')} - {formatCurrency(career.salary_range.max).replace('.00', '')}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 pt-0 space-y-6">
                                            <p className="text-slate-600 leading-relaxed font-medium">{career.reasoning}</p>

                                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-3">
                                                    <div className="text-xs font-black uppercase text-slate-400 tracking-tighter flex items-center gap-2">
                                                        <Target className="h-4 w-4 text-destructive" /> Skills to Master
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {career.missing_skills.map(skill => (
                                                            <span key={skill} className="px-3 py-1.5 bg-white border border-destructive/20 text-destructive text-xs rounded-xl font-bold shadow-sm">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-3">
                                                    <div className="text-xs font-black uppercase text-slate-400 tracking-tighter flex items-center gap-2">
                                                        <Sparkles className="h-4 w-4 text-green-500" /> Your Strengths
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {career.required_skills.filter(s => !career.missing_skills.includes(s)).map(skill => (
                                                            <span key={skill} className="px-3 py-1.5 bg-white border border-green-500/20 text-green-600 text-xs rounded-xl font-bold shadow-sm">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-black font-bold text-white shadow-lg">
                                                Get Detailed Roadmap
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Personality & Learning */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                <Brain className="h-6 w-6 text-indigo-600" />
                            </div>
                            Insights
                        </h2>

                        {/* Personality Analysis */}
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50 to-white">
                            <CardHeader>
                                <CardTitle className="text-lg font-black text-indigo-900">Psychometric Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-6">
                                {/* Radar Chart */}
                                <div className="h-64 w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.personality_analysis}>
                                            <PolarGrid stroke="#e2e8f0" />
                                            <PolarAngleAxis
                                                dataKey="trait"
                                                tick={{ fill: '#4f46e5', fontSize: 10, fontWeight: 700 }}
                                            />
                                            <Radar
                                                name="Score"
                                                dataKey="score"
                                                stroke="#4f46e5"
                                                fill="#4f46e5"
                                                fillOpacity={0.6}
                                            />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>

                                {data.personality_analysis.map((trait, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="font-bold text-indigo-950">{trait.trait}</span>
                                            <span className="text-xl font-black text-indigo-600">{trait.score}%</span>
                                        </div>
                                        <div className="h-3 bg-indigo-100 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                                                style={{ width: `${trait.score}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-indigo-900/60 font-medium leading-relaxed">{trait.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Learning Path */}
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-white">
                            <CardHeader>
                                <CardTitle className="text-lg font-black text-green-900 flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" /> Your Growth Steps
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <ul className="space-y-4">
                                    {data.suggested_learning_path.map((step, i) => (
                                        <li key={i} className="flex gap-4 group">
                                            <span className="flex-none flex items-center justify-center w-8 h-8 rounded-xl bg-green-500 text-white text-sm font-black shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                                                {i + 1}
                                            </span>
                                            <span className="text-sm font-bold text-green-950/70 leading-relaxed group-hover:text-green-900 transition-colors">
                                                {step}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Button
                            variant="outline"
                            className="w-full h-14 rounded-2xl border-2 border-primary/20 text-primary font-black hover:bg-primary/5 shadow-lg group"
                            asChild
                        >
                            <Link href="/mentors">
                                Connect with a Mentor <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
