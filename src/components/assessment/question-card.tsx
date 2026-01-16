
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionCardProps {
    question: string;
    category: string;
    currentValue?: number;
    onAnswer: (value: number) => void;
    index: number;
    total: number;
}

export function QuestionCard({
    question,
    category,
    currentValue,
    onAnswer,
    index,
    total,
}: QuestionCardProps) {
    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
                    <span className="capitalize font-medium">{category}</span>
                    <span>
                        Question {index + 1} of {total}
                    </span>
                </div>
                <CardTitle className="text-xl md:text-2xl leading-tight">{question}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mt-4">
                    <Label className="block mb-4 text-center text-muted-foreground">
                        How much do you agree?
                    </Label>
                    <div className="flex justify-between items-center gap-2 max-w-md mx-auto">
                        <span className="text-xs text-muted-foreground w-12 text-right hidden sm:block">Strongly Disagree</span>
                        <div className="flex-1 flex justify-between gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <div key={value} className="flex flex-col items-center gap-2 group">
                                    <button
                                        onClick={() => onAnswer(value)}
                                        className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold transition-all
                      ${currentValue === value
                                                ? "border-primary bg-primary text-primary-foreground scale-110 shadow-md"
                                                : "border-muted bg-background hover:border-primary/50 hover:bg-primary/5"
                                            }
                    `}
                                        aria-label={`Rate ${value}`}
                                    >
                                        {value}
                                    </button>
                                    <span className="text-[10px] text-muted-foreground sm:hidden">
                                        {value === 1 ? "Disagree" : value === 5 ? "Agree" : value}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground w-12 text-left hidden sm:block">Strongly Agree</span>
                    </div>
                    <div className="flex justify-between sm:hidden px-2 mt-2">
                        <span className="text-xs text-muted-foreground">Strongly Disagree</span>
                        <span className="text-xs text-muted-foreground">Strongly Agree</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
