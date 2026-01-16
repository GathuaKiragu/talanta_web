
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, MessageSquare, MoreVertical, Plus } from "lucide-react";
import Link from "next/link";

const UPCOMING_SESSIONS = [
    {
        mentor: "Sarah Chen",
        role: "Senior Product Designer",
        time: "Tomorrow, 2:00 PM",
        platform: "Zoom",
        status: "Confirmed",
        color: "bg-blue-500"
    }
];

const PAST_SESSIONS = [
    {
        mentor: "Michael Ross",
        role: "Tech Lead",
        date: "Jan 12, 2026",
        rating: 5,
        color: "bg-purple-500"
    }
];

export default function SessionsPage() {
    return (
        <div className="space-y-10 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
                        My Sessions
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Manage your mentorship appointments and growth conversations.
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 transition-opacity h-12 px-6 rounded-xl font-bold shadow-lg" asChild>
                    <Link href="/mentors"><Plus className="mr-2 h-5 w-5" /> Book New Session</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Upcoming Sessions
                    </h2>

                    {UPCOMING_SESSIONS.length > 0 ? (
                        <div className="space-y-4">
                            {UPCOMING_SESSIONS.map((session) => (
                                <Card key={session.mentor} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all group">
                                    <div className="p-6 flex flex-col md:flex-row gap-6">
                                        <div className={`h-24 w-24 rounded-2xl ${session.color} flex items-center justify-center text-white shrink-0 shadow-inner`}>
                                            <Video className="h-10 w-10 opacity-80" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h3 className="text-2xl font-bold tracking-tight">{session.mentor}</h3>
                                                    <p className="text-muted-foreground font-medium">{session.role}</p>
                                                </div>
                                                <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 font-bold text-xs">
                                                    {session.status}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-6 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar className="h-4 w-4 text-primary" /> {session.time}
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Video className="h-4 w-4 text-primary" /> {session.platform}
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button size="sm" className="bg-primary hover:opacity-90">Join Call</Button>
                                                <Button size="sm" variant="outline" className="border-primary/20 hover:bg-primary/5">Reschedule</Button>
                                                <Button size="sm" variant="ghost" className="text-muted-foreground"><MessageSquare className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-muted/30 rounded-3xl p-12 text-center border-2 border-dashed border-muted flex flex-col items-center gap-4">
                            <Calendar className="h-12 w-12 text-muted-foreground/30" />
                            <div className="space-y-1">
                                <p className="text-lg font-semibold">No upcoming sessions</p>
                                <p className="text-muted-foreground">Start your mentorship journey today.</p>
                            </div>
                            <Button variant="secondary" asChild>
                                <Link href="/mentors">Browse Mentors</Link>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Sidebar History/Stats */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
                    <div className="space-y-4">
                        {PAST_SESSIONS.map((session) => (
                            <Card key={session.mentor} className="border-none shadow-md overflow-hidden group hover:shadow-lg transition-all">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl ${session.color}/10 flex items-center justify-center shrink-0`}>
                                        <div className={`h-2 w-2 rounded-full ${session.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold truncate">{session.mentor}</p>
                                        <p className="text-xs text-muted-foreground">{session.date}</p>
                                    </div>
                                    <Button size="icon" variant="ghost" className="shrink-0 h-8 w-8 hover:bg-accent rounded-full"><MoreVertical className="h-4 w-4" /></Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-none shadow-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                            <Clock className="h-24 w-24" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-lg font-bold">Mentorship Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-3xl font-black">12h</p>
                                    <p className="text-[10px] uppercase font-bold text-white/70">Total Time</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-3xl font-black">4</p>
                                    <p className="text-[10px] uppercase font-bold text-white/70">Mentors</p>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-white" />
                            </div>
                            <p className="text-xs text-white/80 font-medium">You're in the top 10% of active mentees!</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
