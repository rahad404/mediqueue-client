"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Pencil,
  Trash2,
  Loader2,
  PlusCircle,
  BookOpen,
  MapPin,
  Users,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Bangla",
  "Computer Science",
  "Electronics",
  "Drawing&Painting",
  "Music",
];
const TEACHING_MODES = ["Online", "Offline", "Both"];

export default function MyTutorsPage() {
  const router = useRouter();
  const { data: sessionStartDate, isPending: sessionLoading } =
    authClient.useSession();
  const currentUser = sessionStartDate?.user;

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editTutor, setEditTutor] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTutor, setDeleteTutor] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // fetch users added tutors
  useEffect(() => {
    if (!currentUser?.email) return;
    const fetchMyTutors = async () => {
      setLoading(true);
      try {
        const { data: tokenData, error: tokenError } = await authClient.token();
        if (tokenError || !tokenData) {
          throw new Error(
            tokenError?.message || "Authentication token not found",
          );
        }
        if (tokenData) {
          const jwtToken = tokenData.token;
          const res = await fetch(
            `${API_BASE}/tutors/user/${currentUser.email}`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            },
          );
          if (res.ok) setTutors(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch your tutors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTutors();
  }, [currentUser?.email]);

  const openEdit = (tutor) => {
    // Convert sessionStartDate to yyyy-mm-dd for the date input
    const dateStr = tutor.sessionStartDate
      ? new Date(tutor.sessionStartDate).toISOString().split("T")[0]
      : "";
    setEditTutor({ ...tutor, sessionStartDate: dateStr });
    setEditOpen(true);
  };

  // submit updates
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const { data: tokenData, error: tokenError } = await authClient.token();
      if (tokenError || !tokenData) {
        throw new Error(
          tokenError?.message || "Authentication token not found",
        );
      }
      if (tokenData) {
        const jwtToken = tokenData.token;
        const { _id, ...updates } = editTutor;
        const res = await fetch(`${API_BASE}/tutors/${_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (res.ok) {
          // Update local state immediately
          setTutors((prev) =>
            prev.map((t) => (t._id === _id ? { ...t, ...updates } : t)),
          );
          setEditOpen(false);
          toast.success("Tutor updated successfully!");
        } else {
          toast.error(data.message || "Update failed.");
        }
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  // delete handle
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const { data: tokenData, error: tokenError } = await authClient.token();
      if (tokenError || !tokenData) {
        throw new Error(
          tokenError?.message || "Authentication token not found",
        );
      }
      if (tokenData) {
        const jwtToken = tokenData.token;
        const res = await fetch(`${API_BASE}/tutors/${deleteTutor._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (res.ok) {
          setTutors((prev) => prev.filter((t) => t._id !== deleteTutor._id));
          setDeleteOpen(false);
          toast.success("Tutor deleted successfully.");
        } else {
          const data = await res.json();
          toast.error(data.message || "Delete failed.");
        }
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // loading
  if (sessionLoading || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your tutors...
          </p>
        </div>
      </div>
    );
  }

  const teachingModeBadge = (mode) => {
    if (mode === "Online")
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400">
          Online
        </Badge>
      );
    if (mode === "Offline")
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-400">
          Offline
        </Badge>
      );
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400">
        Both
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-900/50 py-8 px-4 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50">
              My Tutors
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage all the tutor profiles youve created.
            </p>
          </div>
          <Button
            onClick={() => router.push("/add-tutor")}
            className="gap-2 shrink-0"
          >
            <PlusCircle className="h-4 w-4" /> Add New Tutor
          </Button>
        </div>

        {/* ── Empty state ── */}
        {tutors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-background rounded-xl border border-dashed">
            <GraduationCap className="h-14 w-14 text-muted-foreground stroke-[1.2] mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-zinc-100">
              No tutors yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              You havent added any tutors. Create your first tutor profile to
              get started.
            </p>
            <Button
              onClick={() => router.push("/add-tutor")}
              className="mt-5 gap-2"
            >
              <PlusCircle className="h-4 w-4" /> Add Your First Tutor
            </Button>
          </div>
        ) : (
          /* ── Table ── */
          <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-background shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-zinc-900/60 hover:bg-slate-50 dark:hover:bg-zinc-900/60">
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300 w-12">
                    #
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300">
                    Tutor
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300 hidden md:table-cell">
                    Subject
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300 hidden lg:table-cell">
                    Mode
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300 hidden md:table-cell">
                    Slots
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300 hidden lg:table-cell">
                    Rate/hr
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tutors.map((tutor, idx) => (
                  <TableRow
                    key={tutor._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-zinc-900/30 transition-colors"
                  >
                    <TableCell className="text-muted-foreground text-sm">
                      {idx + 1}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 shrink-0">
                          <img
                            src={
                              tutor.photo ||
                              "https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop"
                            }
                            alt={tutor.tutorName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-zinc-50 leading-tight">
                            {tutor.tutorName}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {tutor.location}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="text-xs font-medium">
                        {tutor.subject}
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      {teachingModeBadge(tutor.teachingMode)}
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <span
                        className={`text-sm font-medium ${tutor.totalSlots <= 0 ? "text-destructive" : "text-slate-700 dark:text-zinc-300"}`}
                      >
                        {tutor.totalSlots <= 0 ? "Full" : tutor.totalSlots}
                      </span>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                        ৳{tutor.hourlyFee}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => openEdit(tutor)}
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            setDeleteTutor(tutor);
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4" /> Update Tutor Profile
            </DialogTitle>
            <DialogDescription>
              Edit the details below. Changes are saved immediately.
            </DialogDescription>
          </DialogHeader>

          {editTutor && (
            <form onSubmit={handleEditSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="tutorName" className="text-xs font-semibold">
                    Tutor Name
                  </Label>
                  <Input
                    id="tutorName"
                    value={editTutor.tutorName || ""}
                    onChange={(e) =>
                      setEditTutor((p) => ({ ...p, tutorName: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="photo" className="text-xs font-semibold">
                    Photo URL
                  </Label>
                  <Input
                    id="photo"
                    value={editTutor.photo || ""}
                    onChange={(e) =>
                      setEditTutor((p) => ({ ...p, photo: e.target.value }))
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Subject</Label>
                  <Select
                    value={editTutor.subject || ""}
                    onValueChange={(v) =>
                      setEditTutor((p) => ({ ...p, subject: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Teaching Mode</Label>
                  <Select
                    value={editTutor.teachingMode || ""}
                    onValueChange={(v) =>
                      setEditTutor((p) => ({ ...p, teachingMode: v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEACHING_MODES.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="availableDays"
                    className="text-xs font-semibold"
                  >
                    Available Days
                  </Label>
                  <Input
                    id="availableDays"
                    value={editTutor.availableDays || ""}
                    onChange={(e) =>
                      setEditTutor((p) => ({
                        ...p,
                        availableDays: e.target.value,
                      }))
                    }
                    placeholder="e.g. Sun - Thu"
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="availableTime"
                    className="text-xs font-semibold"
                  >
                    Time Slot
                  </Label>
                  <Input
                    id="availableTime"
                    value={editTutor.availableTime || ""}
                    onChange={(e) =>
                      setEditTutor((p) => ({
                        ...p,
                        availableTime: e.target.value,
                      }))
                    }
                    placeholder="e.g. 5:00 PM - 8:00 PM"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="hourlyFee" className="text-xs font-semibold">
                    Hourly Fee (৳)
                  </Label>
                  <Input
                    id="hourlyFee"
                    type="number"
                    min={0}
                    value={editTutor.hourlyFee || ""}
                    onChange={(e) =>
                      setEditTutor((p) => ({
                        ...p,
                        hourlyFee: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="totalSlots" className="text-xs font-semibold">
                    Total Slots
                  </Label>
                  <Input
                    id="totalSlots"
                    type="number"
                    min={0}
                    value={editTutor.totalSlots ?? ""}
                    onChange={(e) =>
                      setEditTutor((p) => ({
                        ...p,
                        totalSlots: Number(e.target.value),
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="sessionDate"
                    className="text-xs font-semibold"
                  >
                    Session Start Date
                  </Label>
                  <Input
                    id="sessionDate"
                    type="date"
                    value={editTutor.sessionStartDate || ""}
                    onChange={(e) =>
                      setEditTutor((p) => ({
                        ...p,
                        sessionStartDate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="location" className="text-xs font-semibold">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={editTutor.location || ""}
                    onChange={(e) =>
                      setEditTutor((p) => ({ ...p, location: e.target.value }))
                    }
                    placeholder="Area / City"
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="institution"
                    className="text-xs font-semibold"
                  >
                    Institution
                  </Label>
                  <Input
                    id="institution"
                    value={editTutor.institution || ""}
                    onChange={(e) =>
                      setEditTutor((p) => ({
                        ...p,
                        institution: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="experience" className="text-xs font-semibold">
                    Experience (years)
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    min={0}
                    value={editTutor.experience || ""}
                    onChange={(e) =>
                      setEditTutor((p) => ({
                        ...p,
                        experience: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Delete Tutor?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <strong className="text-slate-900 dark:text-zinc-100">
                {deleteTutor?.tutorName}
              </strong>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteLoading ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
