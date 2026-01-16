import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Clock, Target, Brain, User, Briefcase } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const userName = user?.user_metadata?.full_name || "Student";

    const { data: assessments } = await supabase
        .from("personality_assessments")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

    // Find the latest assessment that HAS traits, or default to the most recent one
    const latestWithTraits = assessments?.find(a => a.traits && Object.keys(a.traits).length > 0);
    const latestAssessment = latestWithTraits || assessments?.[0];

    const careerAnalysis = latestAssessment?.traits as any; // Cast to any to access internal fields easily
    const topCareerMatches = careerAnalysis?.top_careers || [];
    const topMatch = topCareerMatches?.[0];

    return (
        <div className="relative flex flex-col gap-10 pb-12">
            {/* Background decorative elements */}
            <div className="absolute -top-24 -right-24 h-96 w-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute top-1/2 -left-24 h-64 w-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                        Welcome back, {userName}!
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium">
                        Your career journey is evolving. Here's your latest overview.
                    </p>
                </div>
                <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-primary/20 h-12 px-6 rounded-xl font-bold">
                    <Link href="/assessment">Take New Assessment</Link>
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="overflow-hidden border-none shadow-xl bg-white/50 backdrop-blur-sm group hover:shadow-2xl transition-all border-t-4 border-t-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Assessments</CardTitle>
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Target className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-4xl font-black">{assessments?.length || 0}</div>
                        <p className="text-xs text-muted-foreground font-bold mt-1">
                            Tests completed
                        </p>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden border-none shadow-xl bg-white/50 backdrop-blur-sm group hover:shadow-2xl transition-all border-t-4 border-t-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Mentorship</CardTitle>
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <Clock className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-4xl font-black">0</div>
                        <p className="text-xs text-muted-foreground font-bold mt-1">
                            Upcoming sessions
                        </p>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-orange-500 to-red-600 text-white group hover:shadow-2xl hover:shadow-orange-500/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-orange-100">Top Match</CardTitle>
                        <div className="p-2 rounded-lg bg-white/20 text-white">
                            <Star className="h-4 w-4 fill-white" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-4xl font-black">{topMatch ? `${topMatch.match_percentage}%` : "0%"}</div>
                        <p className="text-xs text-orange-50/80 font-bold mt-1 uppercase tracking-tighter">
                            {topMatch ? topMatch.career_name : "No match yet"}
                        </p>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white group hover:shadow-2xl hover:shadow-indigo-500/20 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-indigo-100">Profile</CardTitle>
                        <div className="p-2 rounded-lg bg-white/20 text-white">
                            <User className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-4xl font-black">{assessments && assessments.length > 0 ? "Analyzed" : "Pending"}</div>
                        <p className="text-xs text-indigo-50/80 font-bold mt-1 uppercase tracking-tighter">
                            {assessments && assessments.length > 0 ? "Personality Ready" : "Take a Test"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-7">
                {/* Recent Assessments / History */}
                <Card className="col-span-4 border-none shadow-xl rounded-2xl bg-white/70 backdrop-blur-md overflow-hidden outline outline-1 outline-slate-200/50">
                    <CardHeader className="bg-slate-50/50 border-b">
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" /> Assessment History
                        </CardTitle>
                        <CardDescription className="font-medium">
                            Review your path and psychometric evolution.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {assessments && assessments.length > 0 ? (
                            assessments.map((assessment) => (
                                <div key={assessment.id} className="flex items-center justify-between rounded-2xl border-2 border-transparent bg-slate-50 p-5 hover:border-primary/20 hover:bg-primary/5 hover:shadow-md transition-all group">
                                    <div className="space-y-1.5">
                                        <p className="font-black text-slate-800 tracking-tight text-sm sm:text-base">{assessment.assessment_type === 'riasec' ? 'Holland Code (RIASEC)' : 'Personality Quiz'}</p>
                                        <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(assessment.created_at).toLocaleDateString()}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                                            <span className="text-primary/70 uppercase">Completed</span>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="rounded-xl border-primary/20 text-primary font-bold hover:bg-primary hover:text-white shadow-sm transition-all text-xs" asChild>
                                        <Link href={`/assessment/results/${assessment.id}`}>
                                            Results <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center gap-6">
                                <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 shadow-inner">
                                    <Brain className="h-10 w-10 text-slate-300" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-lg font-bold text-slate-400">No assessments found yet.</p>
                                    <Button className="rounded-xl font-bold bg-primary px-8 h-12 shadow-lg shadow-primary/20" asChild>
                                        <Link href="/assessment">Take your first test</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Career Matches */}
                <Card className="col-span-3 border-none shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Target className="h-40 w-40" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                            Career Matches
                        </CardTitle>
                        <CardDescription className="text-slate-400 font-medium">
                            Paths aligned with your core persona.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-5">
                            {topCareerMatches.length > 0 ? (
                                topCareerMatches.slice(0, 4).map((match: any, i: number) => {
                                    const colors = [
                                        { bg: "bg-orange-500", glow: "shadow-orange-500/40", text: "group-hover:text-orange-400" },
                                        { bg: "bg-purple-500", glow: "shadow-purple-500/40", text: "group-hover:text-purple-400" },
                                        { bg: "bg-blue-500", glow: "shadow-blue-500/40", text: "group-hover:text-blue-400" },
                                        { bg: "bg-emerald-500", glow: "shadow-emerald-500/40", text: "group-hover:text-emerald-400" }
                                    ];
                                    const style = colors[i % colors.length];

                                    return (
                                        <div key={i} className="space-y-2 group cursor-pointer transition-all hover:translate-x-1">
                                            <div className="flex justify-between items-center px-1">
                                                <p className={`text-sm font-black tracking-tight ${style.text} transition-colors uppercase`}>{match.career_name}</p>
                                                <span className="text-[10px] font-black bg-white/10 px-2 py-0.5 rounded-md">{match.match_percentage}%</span>
                                            </div>
                                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full ${style.bg} rounded-full transition-all duration-1000 shadow-lg ${style.glow}`}
                                                    style={{ width: `${match.match_percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center space-y-4">
                                    <div className="h-16 w-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <Briefcase className="h-8 w-8 text-slate-500" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-500">Take an assessment to see matches</p>
                                </div>
                            )}
                        </div>
                        <Button className="w-full mt-4 bg-white text-slate-900 hover:bg-slate-100 font-black h-12 rounded-xl shadow-xl shadow-white/5 transition-all hover:-translate-y-0.5" asChild>
                            <Link href="/careers">Explore All Paths <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                        <p className="text-[10px] text-center uppercase font-black tracking-[0.2em] text-slate-500 pt-2">Powered by Talanta AI</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
