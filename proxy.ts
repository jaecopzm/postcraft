import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is simple because we are using Firebase Auth on the client side.
// Major protection happens at the API layer (via token verification) and Firestore layer (via rules).
// This middleware primarily handles UI redirection for the /dashboard section.

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // We check for a session cookie if we were using next-auth, 
    // but since we're using Firebase Auth client-side, we'll rely on client-side redirects for UI.
    // However, for API routes, we can enforce certain headers if needed.

    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/generate')) {
        // In a real production app with NextAuth, we'd check the token here.
        // For now, we'll allow the request to proceed and let the API/Client handle it.
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/generate/:path*',
        '/api/history/:path*',
    ],
};
