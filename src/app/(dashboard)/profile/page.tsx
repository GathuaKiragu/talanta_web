
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, UserCheck, Edit3, Camera, MapPin, Briefcase, GraduationCap, Brain, Star, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

    const { data: assessments } = await supabase
        .from("personality_assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Find the latest assessment that HAS traits, or default to the most recent one
    const latestWithTraits = assessments?.find(a => a.traits && Object.keys(a.traits).length > 0);
    const latestAssessmentRaw = latestWithTraits || assessments?.[0];

    const latestAssessment = latestAssessmentRaw ? {
        ...latestAssessmentRaw,
        traits: latestAssessmentRaw.traits as any
    } : null;

    const topCareerMatches = latestAssessment?.traits?.top_careers || [];
    const topMatch = topCareerMatches?.[0];

    const userName = user?.user_metadata?.full_name || "Graduate Student";
    const userEmail = user?.email || "student@example.com";
    const initials = getInitials(userName);

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-10 pb-12">
            <div className="relative h-64 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col md:flex-row items-end gap-6 translate-y-12 md:translate-y-16">
                    <div className="relative group">
                        <Avatar className="h-40 w-40 border-8 border-background shadow-2xl rounded-3xl bg-background">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback className="text-4xl font-black bg-gradient-to-br from-primary to-purple-600 text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <Button size="icon" variant="secondary" className="absolute bottom-2 right-2 rounded-xl shadow-lg border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="pb-8 space-y-1 flex-1">
                        <h1 className="text-4xl font-extrabold text-white drop-shadow-md">{userName}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90 font-medium">
                            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {profile?.occupation || "Career Explorer"}</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {profile?.city && profile?.country ? `${profile.city}, ${profile.country}` : "Location not set"}</span>
                        </div>
                    </div>
                    <div className="pb-8 flex gap-3">
                        <Link href="/onboarding?force=true&redirect=/profile">
                            <Button className="bg-white text-primary hover:bg-white/90 font-bold px-6 shadow-xl rounded-xl">
                                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-20 md:mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Details */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" /> Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 grid gap-8 md:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Full Name</p>
                                <p className="text-lg font-semibold">{userName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Email Address</p>
                                <p className="text-lg font-semibold">{userEmail}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Date of Birth</p>
                                <p className="text-lg font-semibold">{formatDate(profile?.date_of_birth)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Gender</p>
                                <p className="text-lg font-semibold capitalize">{profile?.gender?.replace(/_/g, ' ') || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Location</p>
                                <p className="text-lg font-semibold">{profile?.city && profile?.country ? `${profile.city}, ${profile.country}` : "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Account Status</p>
                                <div className="flex items-center gap-2 text-green-600 font-bold">
                                    <UserCheck className="h-4 w-4" /> Active
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" /> Academic Background
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 grid gap-8 md:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Education Level</p>
                                <p className="text-lg font-semibold capitalize">{profile?.education_level?.replace(/_/g, ' ') || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Institution</p>
                                <p className="text-lg font-semibold">{profile?.current_institution || "N/A"}</p>
                            </div>
                            <div className="col-span-full space-y-1">
                                <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Field of Study</p>
                                <p className="text-lg font-semibold">{profile?.field_of_study || "N/A"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {profile?.bio && (
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                            <CardHeader className="bg-muted/30 pb-4">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Edit3 className="h-5 w-5 text-primary" /> Bio / Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Personality Profile from latest assessment */}
                    {latestAssessment && (
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50 to-white relative">
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl flex items-center gap-2 text-indigo-900">
                                    <Brain className="h-5 w-5" /> AI Personality Profile
                                </CardTitle>
                                <CardDescription>Derived from your latest assessment on {formatDate(latestAssessment.created_at)}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <p className="text-indigo-950 font-medium leading-relaxed italic">
                                    "{latestAssessment.traits?.user_profile_summary}"
                                </p>
                                <div className="mt-6">
                                    <Button variant="outline" className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50" asChild>
                                        <Link href={`/assessment/results/${latestAssessment.id}`}>
                                            View Full Analysis <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Stats/Info */}
                <div className="space-y-8">
                    <Card className="border-none shadow-xl rounded-3xl overflow-hidden group text-white bg-gradient-to-br from-indigo-600 to-blue-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-widest text-indigo-100">
                                <Star className="h-4 w-4 fill-white" /> Top Career Match
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4">
                            {topMatch ? (
                                <>
                                    <div className="space-y-1">
                                        <p className="text-3xl font-black">{topMatch.match_percentage}%</p>
                                        <p className="font-bold text-indigo-50 uppercase tracking-tight">{topMatch.career_name}</p>
                                    </div>
                                    <Button variant="secondary" className="w-full rounded-xl font-bold" asChild>
                                        <Link href="/careers">Explore Career</Link>
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm font-medium text-indigo-100/80">Take an assessment to see your top matches.</p>
                                    <Button variant="secondary" className="w-full rounded-xl font-bold" asChild>
                                        <Link href="/assessment">Start Test</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl rounded-3xl overflow-hidden group">
                        <CardHeader className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                            <CardTitle className="text-lg">Career Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span>Profile Completion</span>
                                    <span>{latestAssessment ? "90%" : "70%"}</span>
                                </div>
                                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-1000 group-hover:bg-emerald-400" style={{ width: latestAssessment ? "90%" : "70%" }} />
                                </div>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <UserCheck className="h-3 w-3 text-green-600" />
                                    </div>
                                    Basic Info
                                </li>
                                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className={`h-4 w-4 rounded-full ${latestAssessment ? "bg-green-500/20" : "bg-orange-500/10"} flex items-center justify-center`}>
                                        {latestAssessment ? (
                                            <UserCheck className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                                        )}
                                    </div>
                                    Personality Test
                                </li>
                                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className={`h-4 w-4 rounded-full ${latestAssessment ? "bg-green-500/20" : "bg-orange-500/10"} flex items-center justify-center`}>
                                        {latestAssessment ? (
                                            <UserCheck className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                                        )}
                                    </div>
                                    Career Interests
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 font-bold h-12 rounded-xl">
                        Deactivate Account
                    </Button>
                </div>
            </div>
        </div>
    );
}
