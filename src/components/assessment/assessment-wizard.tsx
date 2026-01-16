
"use client";

import { useEffect, useState } from "react";
import quizData from "@/data/personality-quiz.json";
import { QuestionCard } from "./question-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ResultsView } from "./results-view";
import { DetailedPersonalityAnalysis, CareerAnalysis } from "@/lib/ai/types";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Category = keyof typeof quizData;

interface Question {
    text: string;
    category: Category;
    originalIndex: number;
}

export function AssessmentWizard() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({}); // key: category-index -> value: 1-5
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [resultsId, setResultsId] = useState<string | null>(null);

    // Load and flatten questions on mount
    useEffect(() => {
        const allQuestions: Question[] = [];
        (Object.keys(quizData) as Category[]).forEach((category) => {
            quizData[category].questions.forEach((q, idx) => {
                allQuestions.push({
                    text: q,
                    category,
                    originalIndex: idx,
                });
            });
        });
        // Optional: Shuffle questions here if desired, but keeping grouped for now or user preference
        // For now, let's keep them as is or shuffle? 
        // Let's shuffle to avoid fatigue on one category
        setQuestions(allQuestions.sort(() => Math.random() - 0.5));
    }, []);

    const handleAnswer = (value: number) => {
        if (isSubmitting || isSuccess) return;

        const currentQuestion = questions[currentIndex];
        const key = `${currentQuestion.category}-${currentQuestion.originalIndex}`;

        setAnswers((prev) => ({
            ...prev,
            [key]: value,
        }));

        // Auto-advance after small delay for better UX
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                // Last question answered
                handleSubmit();
            }
        }, 300);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Calculate aggregate scores
        const categoryScores: Record<string, number> = {};
        Object.keys(quizData).forEach(cat => categoryScores[cat] = 0);

        Object.entries(answers).forEach(([key, value]) => {
            const [category] = key.split("-");
            if (categoryScores[category] !== undefined) {
                categoryScores[category] += value;
            }
        });

        try {
            const response = await fetch("/api/assessment/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scores: categoryScores,
                    responses: answers,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Submission failed");
            }

            // Show success state
            setIsSuccess(true);
            setIsSubmitting(false);

            // Store in local storage as a backup for immediate access if needed
            if (data.analysis) {
                localStorage.setItem("latest_career_analysis", JSON.stringify(data.analysis));
            } else {
                localStorage.removeItem("latest_career_analysis");
            }

            // Redirect to the dynamic results page after a brief delay so they see the success message
            setTimeout(() => {
                router.push(`/assessment/results/${data.assessmentId}`);
            }, 2000);
        } catch (error) {
            console.error("Assessment error:", error);
            alert("Something went wrong saving your results. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (questions.length === 0) {
        return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center animate-in zoom-in duration-500">
                <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shadow-lg shadow-green-500/20">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black tracking-tight text-slate-900">Test Completed Successfully!</h2>
                    <p className="text-muted-foreground text-lg font-medium">Your responses have been securely saved.</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border-2 border-slate-100">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="font-bold text-slate-600">Directing you to your AI analysis...</span>
                </div>
            </div>
        );
    }

    if (isSubmitting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 animate-in fade-in">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="text-xl font-semibold">Analyzing your personality...</h3>
                <p className="text-muted-foreground text-center max-w-md">
                    Our AI is reviewing your responses against the Holland Code framework to find your ideal career matches.
                </p>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    // Safety guard for transition states
    if (!currentQuestion) return null;

    const progress = ((currentIndex) / questions.length) * 100;

    return (
        <div className="space-y-6">
            <div className="w-full max-w-2xl mx-auto space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <QuestionCard
                question={currentQuestion.text}
                category={currentQuestion.category}
                currentValue={answers[`${currentQuestion.category}-${currentQuestion.originalIndex}`]}
                onAnswer={handleAnswer}
                index={currentIndex}
                total={questions.length}
            />

            <div className="flex justify-between max-w-2xl mx-auto pt-4">
                <Button
                    variant="ghost"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex((prev) => prev - 1)}
                >
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground self-center">
                    {currentIndex + 1} / {questions.length}
                </div>

                {/* Dev Helper: Fill Randomly */}
                {process.env.NODE_ENV === "development" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-24 right-4 opacity-50 hover:opacity-100"
                        onClick={() => {
                            const randomAnswers: Record<string, number> = {};
                            questions.forEach(q => {
                                randomAnswers[`${q.category}-${q.originalIndex}`] = Math.floor(Math.random() * 5) + 1;
                            });
                            setAnswers(randomAnswers);
                            // Trigger submit manually after state update (might need effect, but let's just fill and let user click 'Next' on last one or add a direct submit)
                            // Actually, easiest is to fill all except last, then navigate to last.
                            const lastIndex = questions.length - 1;
                            setCurrentIndex(lastIndex);
                        }}
                    >
                        Dev: Fill All
                    </Button>
                )}

                {/* Next button handled by auto-advance, but kept for accessibility if needed or manual override */}
                <Button
                    variant="ghost"
                    disabled={currentIndex === questions.length - 1}
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className={currentIndex === questions.length - 1 ? "invisible" : ""}
                >
                    Skip
                </Button>
            </div>
        </div>
    );
}
