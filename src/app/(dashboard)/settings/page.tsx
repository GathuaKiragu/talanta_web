
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Shield, Eye, Smartphone, Palette, Globe, CreditCard } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-10 pb-12">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-muted-foreground text-lg">
                    Customize your experience and manage account preferences.
                </p>
            </div>

            <div className="grid gap-8 max-w-4xl">
                {/* Notifications */}
                <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-muted/30">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Bell className="h-5 w-5 text-blue-500" /> Notifications
                        </CardTitle>
                        <CardDescription>Control how and when you receive updates.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold">Email Notifications</Label>
                                <p className="text-sm text-muted-foreground">Receive weekly career insights and mentor requests.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold">Assessment Reminders</Label>
                                <p className="text-sm text-muted-foreground">Get notified when it's time to refresh your profile.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold">Mobile Push</Label>
                                <p className="text-sm text-muted-foreground">Stay updated on the go with real-time alerts.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                    <CardHeader className="bg-muted/30">
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Palette className="h-5 w-5 text-purple-500" /> Appearance & Display
                        </CardTitle>
                        <CardDescription>Personalize the visual feel of the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-4">
                            <Label className="font-bold">Theme Mode</Label>
                            <div className="grid grid-cols-3 gap-4">
                                <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-primary bg-primary/5">
                                    <div className="h-12 w-20 bg-white rounded-lg border shadow-sm" />
                                    <span className="text-xs font-bold">Light</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border hover:border-primary/50 transition-colors">
                                    <div className="h-12 w-20 bg-slate-900 rounded-lg border shadow-sm" />
                                    <span className="text-xs font-bold">Dark</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-4 rounded-2xl border hover:border-primary/50 transition-colors">
                                    <div className="h-12 w-20 bg-gradient-to-br from-slate-100 to-slate-900 rounded-lg border shadow-sm" />
                                    <span className="text-xs font-bold">System</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold">Reduce Motion</Label>
                                <p className="text-sm text-muted-foreground">Minimize animations for a smoother experience.</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                {/* Account & Billing */}
                <Card className="border-none shadow-xl rounded-2xl border-l-4 border-l-amber-500 bg-amber-50/30">
                    <div className="p-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-lg font-bold">Premium Subscription</h3>
                                <p className="text-sm text-muted-foreground">Currently on the Free Plan. Upgrade for unlimited AI analysis.</p>
                            </div>
                        </div>
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 rounded-xl shadow-lg">Upgrade Now</Button>
                    </div>
                </Card>
            </div>

            <div className="flex justify-end gap-4 max-w-4xl pt-6">
                <Button variant="ghost" className="font-bold">Reset to Default</Button>
                <Button className="bg-primary hover:opacity-90 transition-opacity font-bold px-8 h-12 rounded-xl shadow-xl shadow-primary/20">Save Changes</Button>
            </div>
        </div>
    );
}
