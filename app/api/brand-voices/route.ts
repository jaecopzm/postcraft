import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        let decodedToken;
        try {
            decodedToken = await adminAuth.verifyIdToken(idToken);
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decodedToken.uid;
        const { db } = await import('@/lib/firebase-admin');

        // In a real app we'd fetch from a subcollection: users/{userId}/voices
        // For this MVP, if there is no collection, we return an empty array or a default
        try {
            const voicesSnapshot = await db.collection('users').doc(userId).collection('voices').get();
            const voices = voicesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return NextResponse.json({ success: true, voices });
        } catch (firebaseError) {
            // Return empty if collection doesn't exist yet
            return NextResponse.json({ success: true, voices: [] });
        }
    } catch (error) {
        console.error('Fetch voices error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch brand voices' },
            { status: 500 }
        );
    }
}
