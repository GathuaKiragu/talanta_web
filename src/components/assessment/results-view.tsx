
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { DetailedPersonalityAnalysis } from "@/lib/ai/types";
import { Brain, CheckCircle2, Lightbulb, Map, Target } from "lucide-react";
import Link from "next/link";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface ResultsViewProps {
    scores: Record<string, number>;
    analysis: DetailedPersonalityAnalysis;
}

export function ResultsView({ scores, analysis }: ResultsViewProps) {
    // Prepare chart data
    const chartData = Object.entries(scores).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        fill: "hsl(var(--primary))",
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Summary */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
                    <Brain className="h-8 w-8" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Your Holland Code: {analysis.holland_code}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {analysis.summary_paragraph}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Personality Profile</CardTitle>
                        <CardDescription>Your scores across the 6 dimensions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={100} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.value > 20 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Traits */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Dominant Traits
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {analysis.dominant_traits.map((trait, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium text-sm"
                                >
                                    {trait}
                                </span>
                            ))}
                        </div>
                        <div className="mt-6">
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
                                <Map className="h-4 w-4" /> Ideal Work Environment
                            </h4>
                            <p className="text-sm leading-relaxed">{analysis.work_environment}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Recommended Categories */}
                <Card className="md:col-span-3 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                            <Lightbulb className="h-6 w-6" />
                            Recommended Career Paths
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {analysis.recommended_career_categories.map((cat, i) => (
                                <div key={i} className="p-4 rounded-lg bg-background border shadow-sm flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="font-medium">{cat}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Strengths */}
                <Card>
                    <CardHeader>
                        <CardTitle>Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {analysis.strengths.map((str, i) => (
                                <li key={i}>{str}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Blind Spots */}
                <Card>
                    <CardHeader>
                        <CardTitle>Potential Blind Spots</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {analysis.blind_spots.map((spot, i) => (
                                <li key={i}>{spot}</li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="flex flex-col justify-center items-center text-center p-6 bg-secondary/20">
                    <h3 className="font-bold text-lg mb-2">Ready to explore?</h3>
                    <p className="text-sm text-muted-foreground mb-4">View detailed career matches based on this profile.</p>
                    <Link href="/dashboard">
                        <Button size="lg" className="w-full">
                            Go to Dashboard
                        </Button>
                    </Link>
                </Card>
            </div>
        </div>
    );
}
