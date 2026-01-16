"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, TrendingUp, DollarSign, Brain, Sparkles, Target, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CareerAnalysis } from "@/lib/ai/types";
import { formatCurrency } from "@/lib/utils";

export default function CareersPage() {
    const [latestAnalysis, setLatestAnalysis] = useState<CareerAnalysis | null>(null);
    const [assessmentId, setAssessmentId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isVetting, setIsVetting] = useState(false);
    const [vettingResult, setVettingResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchLatestAssessment() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: assessment } = await supabase
                .from("personality_assessments")
                .select("*")
                .eq("user_id", user.id)
                .not("traits", "is", null)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (assessment) {
                setLatestAnalysis(assessment.traits as unknown as CareerAnalysis);
                setAssessmentId(assessment.id);
            }
            setLoading(false);
        }

        fetchLatestAssessment();
    }, []);

    const handleVetCareer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery || !assessmentId) return;

        setIsVetting(true);
        setVettingResult(null);

        try {
            const response = await fetch("/api/careers/vet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ careerName: searchQuery, assessmentId })
            });

            const data = await response.json();
            if (response.ok) {
                setVettingResult(data.vetting);
            }
        } catch (error) {
            console.error("Vetting Error:", error);
        } finally {
            setIsVetting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">Loading your career roadmap...</p>
        </div>
    );

    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                        Explore Careers
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-medium">
                        Search any career to see how well it fits your Talanta profile.
                    </p>
                </div>
                <form onSubmit={handleVetCareer} className="relative w-full md:w-[450px] group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                        placeholder="Search any career (e.g. Solar Engineer)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-14 shadow-lg rounded-2xl border-none bg-white focus-visible:ring-2 focus-visible:ring-primary text-lg"
                    />
                    <Button
                        type="submit"
                        disabled={isVetting || !searchQuery || !assessmentId}
                        className="absolute right-2 top-2 h-10 rounded-xl px-6 bg-primary hover:bg-primary/90 shadow-md transition-all active:scale-95"
                    >
                        {isVetting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
                    </Button>
                </form>
            </div>

            {/* Vetting Result Overlay/Section */}
            {vettingResult && (
                <div className="animate-in slide-in-from-top-4 duration-500">
                    <Card className="border-2 border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Sparkles className="h-6 w-6" />
                                        <span className="text-sm font-black uppercase tracking-widest">AI Career Analyst</span>
                                    </div>
                                    <h2 className="text-4xl font-black tracking-tight">{searchQuery}</h2>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="px-4 py-1.5 bg-primary/20 backdrop-blur-md rounded-full text-primary font-black border border-primary/30">
                                            {vettingResult.alignment_score}% Match
                                        </div>
                                        <div className="text-slate-300 font-bold flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-green-400" /> {vettingResult.market_outlook}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right hidden md:block">
                                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Potential Salary</div>
                                    <div className="text-3xl font-black text-white">
                                        KES {vettingResult.salary_kes.min.toLocaleString()} - {vettingResult.salary_kes.max.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-8">
                            <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                                <p className="text-xl leading-relaxed font-medium italic text-slate-100">
                                    "{vettingResult.reasoning}"
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 font-black text-sm uppercase tracking-widest text-slate-400">
                                        <Target className="h-4 w-4 text-primary" /> Key Skills to Focus On
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {vettingResult.recommended_skills.map((skill: string) => (
                                            <span key={skill} className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-sm font-bold text-primary shadow-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                    <Button className="h-14 px-8 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-lg group shadow-xl">
                                        Set as Career Goal <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                            <Brain className="h-6 w-6 text-primary" /> Your Top Matches
                        </h2>
                    </div>

                    {!latestAnalysis || !latestAnalysis.top_careers ? (
                        <Card className="p-12 text-center space-y-4 border-dashed border-2 rounded-3xl">
                            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Brain className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black italic">
                                {!latestAnalysis ? "No Personality Data Found" : "Analysis in Progress..."}
                            </h3>
                            <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                                {!latestAnalysis
                                    ? "Complete your assessment to see personalized recommendations."
                                    : "We're still processing your latest assessment. This usually takes less than a minute."}
                            </p>
                            {!latestAnalysis ? (
                                <Link href="/assessment">
                                    <Button className="rounded-xl font-bold bg-primary hover:bg-primary/90 h-12 px-8">Take Assessment Now</Button>
                                </Link>
                            ) : (
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="rounded-xl font-bold bg-slate-900 hover:bg-black h-12 px-8"
                                >
                                    Refresh Page
                                </Button>
                            )}
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {latestAnalysis.top_careers.map((career) => (
                                <Card key={career.career_name} className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all group rounded-3xl">
                                    <div className="flex flex-col md:flex-row">
                                        <div className="p-8 flex-1 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{career.career_name}</h3>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <span className="font-black text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                                                            {career.match_percentage}% Match
                                                        </span>
                                                        <span className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                                                            <TrendingUp className="h-4 w-4 text-green-500" /> {career.outlook}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground font-medium leading-relaxed italic">
                                                {career.reasoning?.substring(0, 150)}...
                                            </p>
                                        </div>
                                        <div className="p-8 md:border-l bg-slate-50 flex flex-col justify-center gap-3 min-w-[220px]">
                                            <div className="mb-2">
                                                <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Est. Salary</div>
                                                <div className="font-black text-slate-900">KES {career.salary_range?.min?.toLocaleString() || "N/A"}</div>
                                            </div>
                                            <Link href={`/careers/${career.career_name.toLowerCase().replace(/\s+/g, '-')}`}>
                                                <Button className="w-full bg-slate-900 hover:bg-black rounded-xl font-bold">Details</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-8">
                    {/* RIASEC Quick Insight */}
                    {latestAnalysis && (
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50 to-white relative">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                            <CardHeader>
                                <CardTitle className="text-lg font-black text-indigo-900">Talanta Profile</CardTitle>
                                <CardDescription className="font-bold text-indigo-900/60 leading-tight">Your personality alignment at a glance.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {latestAnalysis.personality_analysis.slice(0, 3).map((trait) => (
                                    <div key={trait.trait} className="space-y-2">
                                        <div className="flex justify-between font-bold text-sm">
                                            <span>{trait.trait}</span>
                                            <span className="text-indigo-600">{trait.score}%</span>
                                        </div>
                                        <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 shadow-sm" style={{ width: `${trait.score}%` }} />
                                        </div>
                                    </div>
                                ))}
                                <Link href="/assessment">
                                    <Button variant="outline" className="w-full rounded-xl font-bold mt-2 border-2 border-indigo-100 text-indigo-700 hover:bg-indigo-50">View Full Insights</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-lg font-black">Trending Skills in Kenya</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {["Cloud Computing", "Solar Engineering", "AI Ethics", "Fintech", "Data Analysis", "Critical Thinking"].map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-slate-600 text-xs rounded-xl font-bold shadow-sm hover:border-primary/30 transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function Badge({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "secondary" | "outline" }) {
    const variants = {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-input bg-background"
    }
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}
