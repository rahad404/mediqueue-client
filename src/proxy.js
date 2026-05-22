import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // '/add-tutor',
    // '/my-tutor',
    // '/my-booked-sessions',
  ]
}
