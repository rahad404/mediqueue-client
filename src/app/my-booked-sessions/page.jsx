"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Loader2,
  CalendarX,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// just the badge color
function StatusBadge({ status }) {
  const s = status?.toLowerCase();
  if (s === "cancelled")
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/60 dark:text-red-400 gap-1">
        <XCircle className="h-3 w-3" /> Cancelled
      </Badge>
    );
  if (s === "confirmed" || s === "approved")
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 gap-1">
        <CheckCircle2 className="h-3 w-3" /> {status}
      </Badge>
    );
  // Default: "Review Pending" or any other
  return (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-400 gap-1">
      <Clock className="h-3 w-3" /> {status}
    </Badge>
  );
}

export default function MyBookedSessionsPage() {
  const { data: sessionData, isPending: sessionLoading } =
    authClient.useSession();
  const currentUser = sessionData?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancel confirmation
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelBooking, setCancelBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (!currentUser?.email) return;
    const fetchBookings = async () => {
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
          // console.log(jwtToken);
          const res = await fetch(`${API_BASE}/bookings/${currentUser.email}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          if (res.ok) setBookings(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [currentUser?.email]);

  // Confirm cancel
  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      const { data: tokenData, error: tokenError } = await authClient.token();
      if (tokenError || !tokenData) {
        throw new Error(
          tokenError?.message || "Authentication token not found",
        );
      }
      if (tokenData) {
        const jwtToken = tokenData.token;
        // console.log(jwtToken);
        const res = await fetch(`${API_BASE}/bookings/${cancelBooking._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`
          },
          body: JSON.stringify({ bookingStatus: "cancelled" }),
        });
        const data = await res.json();
        if (res.ok) {
          // Update local state
          setBookings((prev) =>
            prev.map((b) =>
              b._id === cancelBooking._id
                ? { ...b, bookingStatus: "cancelled" }
                : b,
            ),
          );
          setCancelOpen(false);
          toast.success("Booking cancelled. Your slot has been released.");
        } else {
          toast.error(data.message || "Failed to cancel booking.");
        }
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  // loader
  if (sessionLoading || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-900/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-50 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            My Booked Sessions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A summary of all the sessions you've registered for.
          </p>
        </div>

        {/* Empty state */}
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-background rounded-xl border border-dashed">
            <CalendarX className="h-14 w-14 text-muted-foreground stroke-[1.2] mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-zinc-100">
              No sessions booked yet
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Browse available tutors and reserve your first learning session.
            </p>
            <Button
              className="mt-5 gap-2"
              onClick={() => (window.location.href = "/tutors")}
            >
              <BookOpen className="h-4 w-4" /> Browse Tutors
            </Button>
          </div>
        ) : (
          /* Table */
          <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-background shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-zinc-900/60 hover:bg-slate-50 dark:hover:bg-zinc-900/60">
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300 w-10">
                    #
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300">
                    Tutor
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300 hidden sm:table-cell">
                    Student
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300 hidden md:table-cell">
                    Phone
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300 hidden lg:table-cell">
                    Booked On
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-zinc-300 text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {bookings.map((booking, idx) => {
                  const isCancelled =
                    booking.bookingStatus?.toLowerCase() === "cancelled";
                  return (
                    <TableRow
                      key={booking._id}
                      className={`hover:bg-slate-50/60 dark:hover:bg-zinc-900/30 transition-colors ${isCancelled ? "opacity-60" : ""}`}
                    >
                      <TableCell className="text-muted-foreground text-sm">
                        {idx + 1}
                      </TableCell>

                      <TableCell>
                        <p className="font-semibold text-sm text-slate-900 dark:text-zinc-50">
                          {booking.tutorName}
                        </p>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-zinc-300">
                          <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {booking.studentName}
                        </div>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {booking.studentPhone}
                        </span>
                      </TableCell>

                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString(
                                "en-US",
                                { dateStyle: "medium" },
                              )
                            : "—"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={booking.bookingStatus} />
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-1.5 text-xs border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                          disabled={isCancelled}
                          onClick={() => {
                            setCancelBooking(booking);
                            setCancelOpen(true);
                          }}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          {isCancelled ? "Cancelled" : "Cancel"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* ── Summary footer ── */}
        {bookings.length > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
            <span>
              {bookings.length} total booking{bookings.length !== 1 ? "s" : ""}
            </span>
            <span>
              {
                bookings.filter(
                  (b) => b.bookingStatus?.toLowerCase() !== "cancelled",
                ).length
              }{" "}
              active
            </span>
          </div>
        )}
      </div>

      {/* cancle confirmation */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Cancel this session?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You're about to cancel your booking with{" "}
              <strong className="text-slate-900 dark:text-zinc-100">
                {cancelBooking?.tutorName}
              </strong>
              . The slot will be released back to the tutor. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={cancelLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelLoading ? "Cancelling..." : "Yes, Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
