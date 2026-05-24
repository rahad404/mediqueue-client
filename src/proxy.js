import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// Specify the exact routes you want this protection to apply to
export const config = {
    matcher: [
        "/tutors/:path*",
        "/add-tutor",
        "/my-tutor",
        "/my-booked-sessions",
        "/profile",
        "/profile"
    ],
};