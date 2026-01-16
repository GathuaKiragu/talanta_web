"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Brain, ArrowRight, ArrowLeft, Upload, Plus, X, GraduationCap, Briefcase, User, ClipboardCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const EDUCATION_LEVELS = [
    { value: "high_school", label: "High School" },
    { value: "undergraduate", label: "Undergraduate" },
    { value: "graduate", label: "Graduate" },
    { value: "postgraduate", label: "Postgraduate" },
    { value: "other", label: "Other" },
];

const INTERESTS = [
    "Technology", "Healthcare", "Business", "Arts", "Science",
    "Education", "Finance", "Engineering", "Marketing", "Design",
    "Law", "Media", "Sports", "Environment", "Social Work"
];

const GENDERS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
];

const SUBJECTS = [
    "Mathematics", "English", "Physics", "Chemistry", "Biology",
    "History", "Geography", "Economics", "Business Studies", "Computer Science",
    "Fine Arts", "Music", "Physical Education"
];

const GRADES = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "E"];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState<string | null>(null);

    // Step 1: Personal
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");

    // Step 2: Education
    const [educationLevel, setEducationLevel] = useState("");
    const [fieldOfStudy, setFieldOfStudy] = useState("");
    const [currentInstitution, setCurrentInstitution] = useState("");

    // Step 3: High School Results
    const [highSchoolResults, setHighSchoolResults] = useState<{ subject: string; grade: string }[]>([]);
    const [reportFormFile, setReportFormFile] = useState<File | null>(null);
    const [reportFormUrl, setReportFormUrl] = useState("");

    // Step 4: Employment
    const [isOver18, setIsOver18] = useState(false);
    const [occupation, setOccupation] = useState("");

    // Step 5: Interests & Bio
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [bio, setBio] = useState("");

    useEffect(() => {
        const checkUserAndFetchProfile = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);

                // Fetch existing profile data
                const { data: profile } = await supabase
                    .from("user_profiles")
                    .select("*")
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (profile) {
                    setDob(profile.date_of_birth || "");
                    setGender(profile.gender || "");
                    setCountry(profile.country || "");
                    setCity(profile.city || "");
                    setEducationLevel(profile.education_level || "");
                    setFieldOfStudy(profile.field_of_study || "");
                    setCurrentInstitution(profile.current_institution || "");
                    setHighSchoolResults(profile.high_school_results || []);
                    setOccupation(profile.occupation || "");
                    setSelectedInterests(profile.interests || []);
                    setBio(profile.bio || "");
                }
            }
        };
        checkUserAndFetchProfile();
    }, []);

    useEffect(() => {
        if (dob) {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            setIsOver18(age >= 18);
        }
    }, [dob]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setReportFormFile(file);
        }
    };

    const addSubjectResult = () => {
        setHighSchoolResults([...highSchoolResults, { subject: "", grade: "" }]);
    };

    const updateSubjectResult = (index: number, field: "subject" | "grade", value: string) => {
        const newResults = [...highSchoolResults];
        newResults[index][field] = value;
        setHighSchoolResults(newResults);
    };

    const removeSubjectResult = (index: number) => {
        setHighSchoolResults(highSchoolResults.filter((_, i) => i !== index));
    };

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter((i) => i !== interest));
        } else {
            if (selectedInterests.length < 5) {
                setSelectedInterests([...selectedInterests, interest]);
            }
        }
    };

    const validateStep = () => {
        setError("");
        switch (step) {
            case 1:
                if (!dob) return "Date of birth is required";
                if (!gender) return "Gender is required";
                if (!country) return "Country is required";
                if (!city) return "City is required";
                break;
            case 2:
                if (!educationLevel) return "Education level is required";
                break;
            case 3:
                if (highSchoolResults.length === 0) return "Please add at least one subject result";
                if (highSchoolResults.some(r => !r.subject || !r.grade)) return "Please fill in all subject details";
                if (!reportFormFile) return "Please upload your report form";
                break;
            case 5:
                if (selectedInterests.length === 0) return "Please select at least one interest";
                break;
        }
        return "";
    };

    const nextStep = () => {
        const err = validateStep();
        if (err) {
            setError(err);
            return;
        }
        // Skip employment if under 18
        if (step === 3 && !isOver18) {
            setStep(5);
        } else {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        setError("");
        if (step === 5 && !isOver18) {
            setStep(3);
        } else {
            setStep(step - 1);
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        setError("");

        try {
            const supabase = createClient();
            if (!userId) throw new Error("Not authenticated");

            let uploadedUrl = "";
            if (reportFormFile) {
                const fileExt = reportFormFile.name.split('.').pop();
                const fileName = `${userId}-${Math.random()}.${fileExt}`;
                const { data, error: uploadError } = await supabase.storage
                    .from('onboarding-docs')
                    .upload(fileName, reportFormFile);

                if (uploadError) throw uploadError;
                uploadedUrl = data.path;
            }

            // Ensure user record exists in public.users before profile upsert
            const { data: userRecord, error: userRecError } = await supabase
                .from("users")
                .select("id")
                .eq("id", userId)
                .maybeSingle();

            if (!userRecord || userRecError) {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                await supabase.from("users").insert({
                    id: userId,
                    email: authUser?.email,
                    full_name: authUser?.user_metadata?.full_name || "User",
                    credits: 5
                });
            }

            // Create user profile
            const { error: profileError } = await supabase
                .from("user_profiles")
                .upsert({
                    user_id: userId,
                    date_of_birth: dob,
                    gender: gender,
                    country: country,
                    city: city,
                    education_level: educationLevel,
                    current_institution: currentInstitution,
                    field_of_study: fieldOfStudy,
                    high_school_results: highSchoolResults,
                    report_form_url: uploadedUrl,
                    occupation: occupation,
                    interests: selectedInterests,
                    bio: bio,
                    updated_at: new Date().toISOString()
                });

            if (profileError) throw profileError;

            // Update user onboarding status
            const { error: userUpdateError } = await supabase
                .from("users")
                .update({ onboarding_completed: true })
                .eq("id", userId);

            if (userUpdateError) throw userUpdateError;

            const searchParams = new URLSearchParams(window.location.search);
            const redirectPath = searchParams.get("redirect") || "/assessment";

            router.push(redirectPath);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to save profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-white p-4">
            <div className="w-full max-w-2xl">
                <div className="mb-8 flex flex-col items-center gap-2">
                    <div className="bg-primary/10 p-3 rounded-2xl">
                        <Brain className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        Talanta Career Guide
                    </h1>
                    <p className="text-center text-muted-foreground">
                        Help us build your professional profile
                    </p>
                </div>

                {/* Progress */}
                <div className="mb-8 flex items-center justify-between px-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="flex flex-col items-center gap-2">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${s === step ? "border-primary bg-primary text-primary-foreground shadow-lg scale-110" :
                                s < step ? "border-primary bg-primary/20 text-primary" : "border-muted bg-white text-muted-foreground"
                                }`}>
                                {s === 1 && <User className="h-5 w-5" />}
                                {s === 2 && <GraduationCap className="h-5 w-5" />}
                                {s === 3 && <ClipboardCheck className="h-5 w-5" />}
                                {s === 4 && <Briefcase className="h-5 w-5" />}
                                {s === 5 && <Plus className="h-5 w-5" />}
                            </div>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground hidden sm:block">
                                {s === 1 && "Personal"}
                                {s === 2 && "Education"}
                                {s === 3 && "Academic"}
                                {s === 4 && "Work"}
                                {s === 5 && "Profile"}
                            </span>
                        </div>
                    ))}
                </div>

                <Card className="shadow-2xl border-none bg-white/80 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {step === 1 && "Personal Information"}
                            {step === 2 && "Education Background"}
                            {step === 3 && "Recent Academic Results"}
                            {step === 4 && "Employment Status"}
                            {step === 5 && "Profile & Interests"}
                        </CardTitle>
                        <CardDescription>
                            {step === 1 && "Tell us a bit about yourself. This helps us personalize your journey."}
                            {step === 2 && "Tell us about your current academic status."}
                            {step === 3 && "Add your latest high school subjects and upload your report form."}
                            {step === 4 && "What is your current occupation?"}
                            {step === 5 && "What are you passionate about?"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
                                {error}
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <Input
                                            id="dob"
                                            type="date"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Gender</Label>
                                        <Select value={gender} onValueChange={setGender}>
                                            <SelectTrigger className="h-12">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {GENDERS.map(g => (
                                                    <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            placeholder="e.g. Kenya"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            placeholder="e.g. Nairobi"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Highest Education Level</Label>
                                    <Select value={educationLevel} onValueChange={setEducationLevel}>
                                        <SelectTrigger className="h-12 text-lg">
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {EDUCATION_LEVELS.map(level => (
                                                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="institution">Latest Institution</Label>
                                    <Input
                                        id="institution"
                                        placeholder="Name of your school or university"
                                        value={currentInstitution}
                                        onChange={(e) => setCurrentInstitution(e.target.value)}
                                        className="h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="field">Major / Field of Study</Label>
                                    <Input
                                        id="field"
                                        placeholder="e.g. Science, Arts, Computer Science"
                                        value={fieldOfStudy}
                                        onChange={(e) => setFieldOfStudy(e.target.value)}
                                        className="h-12"
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Label>Grades by Subject</Label>
                                    <div className="space-y-3">
                                        {highSchoolResults.map((res, index) => (
                                            <div key={index} className="flex gap-2 items-center animate-in slide-in-from-left-2 duration-200">
                                                <Select value={res.subject} onValueChange={(val: string) => updateSubjectResult(index, 'subject', val)}>
                                                    <SelectTrigger className="flex-1">
                                                        <SelectValue placeholder="Subject" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Select value={res.grade} onValueChange={(val: string) => updateSubjectResult(index, 'grade', val)}>
                                                    <SelectTrigger className="w-24">
                                                        <SelectValue placeholder="Grade" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Button variant="ghost" size="icon" onClick={() => removeSubjectResult(index)} className="text-destructive">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={addSubjectResult}
                                            className="w-full border-dashed"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Subject
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Report Form Upload</Label>
                                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${reportFormFile ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                                        } relative`}>
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileUpload}
                                            accept=".pdf,image/*"
                                        />
                                        {reportFormFile ? (
                                            <div className="flex items-center justify-center gap-2 text-primary">
                                                <ClipboardCheck className="h-8 w-8" />
                                                <span className="font-medium">{reportFormFile.name}</span>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex justify-center">
                                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <p className="text-sm text-muted-foreground">Click or drag to upload report form (PDF/Image)</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="occupation">Current Occupation</Label>
                                    <Input
                                        id="occupation"
                                        placeholder="e.g. Student, Software Developer, Teacher"
                                        value={occupation}
                                        onChange={(e) => setOccupation(e.target.value)}
                                        className="h-12"
                                    />
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label>Areas of Interest (Select 1-5)</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {INTERESTS.map((interest) => (
                                            <button
                                                key={interest}
                                                type="button"
                                                onClick={() => toggleInterest(interest)}
                                                disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 5}
                                                className={`px-4 py-2 rounded-full border text-sm transition-all ${selectedInterests.includes(interest)
                                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                                    : "bg-white border-input hover:border-primary/50 disabled:opacity-50"
                                                    }`}
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Professional Summary / Bio</Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Draft a short summary of your professional journey or career aspirations..."
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="min-h-32 rounded-xl"
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex gap-3 pt-6 border-t">
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={loading}
                                className="h-12 flex-1 rounded-xl"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        )}
                        {step < 5 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                disabled={loading}
                                className="h-12 flex-1 rounded-xl gap-2 shadow-lg shadow-primary/20"
                            >
                                Continue
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleComplete}
                                disabled={loading}
                                className="h-12 flex-1 rounded-xl gap-2 shadow-lg shadow-primary/30 bg-gradient-to-r from-primary to-blue-600"
                            >
                                {loading ? "Completing Profile..." : "Complete Setup"}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
