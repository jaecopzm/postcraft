import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';
import { getStagedPosts, saveStagedPost, updateStagedPostStatus } from '@/lib/firestore';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const posts = await getStagedPosts(userId);
        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Staging GET error:', error);
        return NextResponse.json({ error: 'Failed to fetch staged posts' }, { status: 500 });
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
        const { historyId, platform, content } = body;

        const postId = await saveStagedPost(userId, {
            historyId,
            platform,
            content,
            status: 'staged'
        });

        return NextResponse.json({ success: true, id: postId });
    } catch (error) {
        console.error('Staging POST error:', error);
        return NextResponse.json({ error: 'Failed to stage post' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const { id, status } = await request.json();

        await updateStagedPostStatus(id, status);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Staging PATCH error:', error);
        return NextResponse.json({ error: 'Failed to update post status' }, { status: 500 });
    }
}
