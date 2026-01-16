import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Map,
    Users,
    Calendar,
    Settings,
    LogOut,
    Brain,
    UserCircle,
    Coins,
    Zap,
    ShieldCheck
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user details for credits and subscription
    const { data: dbUser } = await supabase
        .from("users")
        .select("credits, subscription_type, subscription_status")
        .eq("id", user.id)
        .single();

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full border-b bg-muted/40 md:w-64 md:border-r md:min-h-screen shrink-0">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold">
                        <Brain className="h-6 w-6 text-primary" />
                        <span>Talanta Career Guide</span>
                    </Link>
                </div>
                <div className="flex flex-col gap-2 p-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/assessment">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Map className="h-4 w-4" />
                            My Path
                        </Button>
                    </Link>
                    <Link href="/careers">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Brain className="h-4 w-4" />
                            Explore Careers
                        </Button>
                    </Link>
                </div>

                <div className="px-6 py-4 border-t border-b bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Coins className="h-4 w-4 text-amber-500" />
                            Credits
                        </div>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                            {dbUser?.credits || 0} left
                        </Badge>
                    </div>
                    <Progress value={(dbUser?.credits || 0) / 10 * 100} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-2">
                        {dbUser?.credits > 0 ? "You have enough credits for a test." : "Top up to take an assessment."}
                    </p>
                </div>
                <div className="mt-auto p-4 flex flex-col gap-2">
                    {dbUser?.subscription_type === 'free' && (
                        <div className="mx-2 mb-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20">
                            <div className="flex items-center gap-2 mb-2 font-bold text-xs text-primary">
                                <Zap className="h-3 w-3" />
                                UPGRADE PLAN
                            </div>
                            <p className="text-[11px] text-muted-foreground mb-3 leading-tight">
                                Get PDF reports and priority AI analysis.
                            </p>
                            <Link href="/pricing">
                                <Button size="sm" className="w-full h-8 text-[11px] bg-primary hover:bg-primary/90">
                                    View Plans
                                </Button>
                            </Link>
                        </div>
                    )}

                    <Link href="/profile">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <UserCircle className="h-4 w-4" />
                            Profile
                        </Button>
                    </Link>
                    <Link href="/settings">
                        <Button variant="ghost" className="w-full justify-start gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>
                    </Link>
                    <form action="/api/auth/signout" method="post">
                        <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
