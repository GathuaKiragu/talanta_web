import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, MapPin, Briefcase } from "lucide-react";
import { formatCurrency, getInitials } from "@/lib/utils";

export interface Mentor {
    id: string;
    professional_title: string;
    full_name: string; // Joined from users table
    avatar_url?: string;
    company: string;
    years_of_experience: number;
    rating: number;
    total_reviews: number;
    hourly_rate: number;
    currency: string;
    expertise_areas: string[];
    bio: string;
}

interface MentorCardProps {
    mentor: Mentor;
    onBook: (mentorId: string) => void;
}

export function MentorCard({ mentor, onBook }: MentorCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-2xl transition-all hover:-translate-y-1 border-none shadow-lg overflow-hidden group">
            <div className="h-2 w-full bg-gradient-to-r from-primary via-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="p-6 pb-2">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4">
                        <Avatar className="h-12 w-12 border">
                            <AvatarImage src={mentor.avatar_url} alt={mentor.full_name} />
                            <AvatarFallback>{getInitials(mentor.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg leading-none">{mentor.full_name}</h3>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                <Briefcase className="h-3 w-3" /> {mentor.professional_title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                at {mentor.company}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-sm font-bold text-amber-600 shadow-sm">
                        <Star className="h-3 w-3 fill-amber-500 stroke-amber-500" />
                        {mentor.rating.toFixed(1)}
                        <span className="text-[10px] text-amber-400 font-normal">({mentor.total_reviews})</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-2 flex-1">
                <div className="space-y-4">
                    {/* Bio Truncated */}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {mentor.bio}
                    </p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-1.5">
                        {mentor.expertise_areas.slice(0, 3).map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs font-normal">
                                {area}
                            </Badge>
                        ))}
                        {mentor.expertise_areas.length > 3 && (
                            <Badge variant="outline" className="text-xs font-normal">
                                +{mentor.expertise_areas.length - 3} more
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {mentor.years_of_experience}+ Years Exp.
                        </div>
                        <div className="flex items-center gap-1 text-foreground font-medium">
                            <MapPin className="h-3 w-3 text-muted-foreground" /> Remote
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex items-center justify-between border-t bg-muted/20 mt-auto">
                <div className="flex flex-col p-4 pl-0">
                    <span className="text-sm text-muted-foreground">Session Price</span>
                    <span className="text-lg font-bold">{formatCurrency(mentor.hourly_rate / 100, mentor.currency)}</span>
                </div>
                <Button onClick={() => onBook(mentor.id)} className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">Book Session</Button>
            </CardFooter>
        </Card>
    );
}
