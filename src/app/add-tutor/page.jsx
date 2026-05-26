"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader2, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {Card, CardContent, CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Import Better-Auth client instance
import { authClient } from "@/lib/auth-client";

export default function AddTutorPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [startDate, setStartDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const currentSession = await authClient.getSession();
      if (!currentSession?.data) {
        // Not logged in? Boot them to login page
        router.push("/login");
      } else {
        setSession(currentSession.data.user);
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate) {
      toast.error("Please select a session start date.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    // Structure
    const tutorData = {
      tutorName: rawData.tutorName,
      photo: imageUrl,
      subject: rawData.subject,
      availableDays: rawData.availableDays,
      availableTime: rawData.availableTime,
      hourlyFee: Number(rawData.hourlyFee),
      totalSlots: Number(rawData.totalSlots),
      sessionStartDate: startDate.toISOString(),
      institution: rawData.institution,
      experience: rawData.experience,
      location: rawData.location,
      teachingMode: rawData.teachingMode,
      createdBy: session.email,
      userId: session.id,
    };

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;

    try {
      const { data: tokenData, error: tokenError} = await authClient.token();

      if (tokenError || !tokenData) {
        throw new Error(tokenError?.message || "Authentication token not found",);
      }
      if (tokenData) {
        const jwtToken = tokenData.token;
        const res = await fetch(`${API_BASE}/tutors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(tutorData),
        });

        if (res.ok) {
          toast.success("Tutor profile added successfully!");
          router.push("/tutors");
        } else {
          toast.error("Something went wrong creating the profile.");
        }
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Server connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loader
  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 px-4 sm:px-6 lg:px-8 dark:bg-zinc-900/50">
      <Card className="mx-auto max-w-3xl shadow-md backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Become a Tutor
          </CardTitle>
          <CardDescription>
            Fill out the information profile details to submit your teaching
            services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Basic Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="tutorName">Tutor Full Name</Label>
                <Input
                  id="tutorName"
                  name="tutorName"
                  placeholder="Dr. Jane Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject / Category</Label>
                <Select name="subject" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Bangla">Bangla</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Drawing&Painting">Drawing & Painting</SelectItem>
                    <SelectItem value="Music">Music</SelectItem>

                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="teachingMode">Teaching Mode</Label>
                <Select name="teachingMode" required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Both">Both Modes Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Media Management */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="photoLink">Paste Image Link directly</Label>
                <Input
                  id="photoLink"
                  name="photoLink"
                  placeholder="https://postimg.cc/image-link"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Row 3: Availability Blocks */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="availableDays">Available Days</Label>
                <Input
                  id="availableDays"
                  name="availableDays"
                  placeholder="e.g. Sun - Thu, Fri - Sat"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableTime">Available Time Slot</Label>
                <Input
                  id="availableTime"
                  name="availableTime"
                  placeholder="e.g. 5:00 PM - 8:00 PM"
                  required
                />
              </div>
            </div>

            {/* Row 4: Metrics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hourlyFee">Hourly Fee ($)</Label>
                <Input
                  id="hourlyFee"
                  name="hourlyFee"
                  type="number"
                  min="0"
                  placeholder="25"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalSlots">Total Student Slots</Label>
                <Input
                  id="totalSlots"
                  name="totalSlots"
                  type="number"
                  min="1"
                  placeholder="5"
                  required
                />
              </div>
            </div>

            {/* Row 6: Structural Logistics & date */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location (Area/City)</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Mirpur, Dhaka"
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <Label className="mb-2">Session Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Row 5: Experience Metrics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution / University</Label>
                <Input
                  id="institution"
                  name="institution"
                  placeholder="MIT, Dhaka University, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Teaching Experience</Label>
                <Input
                  id="experience"
                  name="experience"
                  placeholder="e.g. 3+ Years, Ex-Instructor at X"
                  required
                />
              </div>
            </div>

            {/* Action Operations Tray */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full text-base font-semibold h-11"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Tutor Profile...
                  </>
                ) : (
                  "Submit Tutor Application"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
