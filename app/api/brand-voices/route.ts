import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth, db } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

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

        const voicesSnapshot = await db.collection('users').doc(userId).collection('voices').orderBy('createdAt', 'desc').get();
        const voices = voicesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
        }));

        return NextResponse.json({ success: true, voices });
    } catch (error) {
        console.error('Fetch voices error:', error);
        return NextResponse.json({ error: 'Failed to fetch brand voices' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const body = await request.json();
        const { id, name, tone, keywords, style, isDefault, brandGuide } = body;

        const voicesRef = db.collection('users').doc(userId).collection('voices');

        if (isDefault) {
            // Unset other defaults
            const currentDefaults = await voicesRef.where('isDefault', '==', true).get();
            const batch = db.batch();
            currentDefaults.docs.forEach(doc => {
                batch.update(doc.ref, { isDefault: false });
            });
            await batch.commit();
        }

        let voiceId = id;
        if (id) {
            await voicesRef.doc(id).update({
                name, tone, keywords, style, isDefault, brandGuide,
                updatedAt: Timestamp.now()
            });
        } else {
            const newDoc = await voicesRef.add({
                name, tone, keywords, style, isDefault,
                brandGuide: brandGuide || '',
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });
            voiceId = newDoc.id;
        }

        return NextResponse.json({ success: true, id: voiceId });
    } catch (error) {
        console.error('Save voice error:', error);
        return NextResponse.json({ error: 'Failed to save brand voice' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const { searchParams } = new URL(request.url);
        const voiceId = searchParams.get('id');

        if (!voiceId) {
            return NextResponse.json({ error: 'Missing voice ID' }, { status: 400 });
        }

        await db.collection('users').doc(userId).collection('voices').doc(voiceId).delete();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete voice error:', error);
        return NextResponse.json({ error: 'Failed to delete brand voice' }, { status: 500 });
    }
}
