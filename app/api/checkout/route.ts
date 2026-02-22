import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        let user;
        try {
            user = await adminAuth.verifyIdToken(idToken);
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = user.uid;

        // 2. Paddle v2 is mostly client-side overlay.
        // We just return a success indicating the user is authorized.
        // If we needed to generate a specific transaction server-side we'd do it here.

        return NextResponse.json({
            success: true,
            message: 'Authorized for checkout',
            userId
        });

    } catch (error) {
        console.error('Checkout API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
