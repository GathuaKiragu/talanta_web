"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { MentorCard, type Mentor } from "@/components/mentorship/mentor-card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea"

import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { formatCurrency } from "@/lib/utils"

// Dummy data for MVP - In real app, this comes from Supabase
const SAMPLE_MENTORS: Mentor[] = [
    {
        id: "1",
        full_name: "Sarah Chen",
        professional_title: "Senior Product Designer",
        company: "Google",
        years_of_experience: 8,
        rating: 4.9,
        total_reviews: 42,
        hourly_rate: 15000, // cents
        currency: "USD",
        expertise_areas: ["UX Design", "Product Strategy", "Career Growth", "Portfolio Review"],
        bio: "Passionate about helping junior designers grow. I can help you review your portfolio, prepare for interviews, or navigate corporate dynamics.",
        avatar_url: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        id: "2",
        full_name: "Michael Ross",
        professional_title: "Tech Lead",
        company: "Netflix",
        years_of_experience: 12,
        rating: 5.0,
        total_reviews: 28,
        hourly_rate: 20000,
        currency: "USD",
        expertise_areas: ["System Design", "Backend Engineering", "Leadership", "Python"],
        bio: "Backend specialist with over a decade of experience scaling high-traffic systems. Let's talk about architecture or how to move into leadership.",
        avatar_url: "https://i.pravatar.cc/150?u=michael"
    },
    {
        id: "3",
        full_name: "Jessica Pearson",
        professional_title: "Marketing Director",
        company: "Spotify",
        years_of_experience: 10,
        rating: 4.8,
        total_reviews: 35,
        hourly_rate: 12000,
        currency: "USD",
        expertise_areas: ["Brand Strategy", "Digital Marketing", "Team Management"],
        bio: "Helping marketers bridge the gap between creative and data. Specializing in brand storytelling and growth marketing.",
        avatar_url: "https://i.pravatar.cc/150?u=jessica"
    },
    {
        id: "4",
        full_name: "David Kim",
        professional_title: "Machine Learning Engineer",
        company: "OpenAI",
        years_of_experience: 5,
        rating: 4.7,
        total_reviews: 15,
        hourly_rate: 25000,
        currency: "USD",
        expertise_areas: ["NLP", "Deep Learning", "Career Transition", "Python"],
        bio: "Transitioned from Physics to ML. I can guide you on the math and coding skills needed to break into AI.",
        avatar_url: "https://i.pravatar.cc/150?u=david"
    }
];

export default function MentorsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Filtering logic (basic for MVP)
    const filteredMentors = SAMPLE_MENTORS.filter(mentor =>
        mentor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.professional_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise_areas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleBook = (mentorId: string) => {
        const mentor = SAMPLE_MENTORS.find(m => m.id === mentorId);
        if (mentor) setSelectedMentor(mentor);
    };

    const handleConfirmBooking = () => {
        // In a real app, this would create a booking record and redirect to payment
        alert(`Booking request sent to ${selectedMentor?.full_name} for ${date ? format(date, "PPP") : "selected date"}`);
        setSelectedMentor(null);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Find a Mentor</h1>
                    <p className="text-muted-foreground">
                        Connect with industry experts who can guide your career journey.
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, role, or skill..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" /> Filters
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMentors.map((mentor) => (
                    <MentorCard key={mentor.id} mentor={mentor} onBook={handleBook} />
                ))}
                {filteredMentors.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No mentors found matching your search.
                    </div>
                )}
            </div>

            {/* Booking Dialog */}
            <Dialog open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Book a Session with {selectedMentor?.full_name}</DialogTitle>
                        <DialogDescription>
                            Select a date and time for your 1:1 mentorship session.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">Select Date</Label>
                            <div className="border rounded-md p-4 flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="note">Message to Mentor (Optional)</Label>
                            <Textarea placeholder="Briefly describe what you'd like to discuss..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <div className="flex justify-between items-center w-full">
                            <div className="text-sm font-semibold">
                                Total: {selectedMentor && formatCurrency(selectedMentor.hourly_rate / 100, selectedMentor.currency)}
                            </div>
                            <Button onClick={handleConfirmBooking}>Confirm & Pay</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
