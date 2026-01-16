
import { AssessmentWizard } from "@/components/assessment/assessment-wizard";

export default function AssessmentPage() {
    return (
        <div className="container py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Personality Assessment</h1>
                <p className="text-muted-foreground mt-2">
                    Discover your ideal career path by answering a few simple questions.
                    There are no wrong answers—just be honest about what you like!
                </p>
            </div>

            <AssessmentWizard />
        </div>
    );
}
