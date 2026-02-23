// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { paddle } from '@/lib/paddle';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    const signature = request.headers.get('paddle-signature') || '';
    const body = await request.text();

    try {
        const secret = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET || '';

        if (!secret) {
            console.error('⚠️ PADDLE_NOTIFICATION_WEBHOOK_SECRET is empty. Did you restart the Next.js dev server after adding it to .env.local?');
            return NextResponse.json({ error: 'Secret missing' }, { status: 500 });
        }

        if (!signature) {
            console.error('⚠️ paddle-signature header is missing from the webhook request.');
            return NextResponse.json({ error: 'Signature missing' }, { status: 400 });
        }

        // Verify the webhook signature
        let eventData: any;
        try {
            eventData = await paddle.webhooks.unmarshal(body, secret, signature);
        } catch (e: any) {
            console.error('⚠️ Paddle webhook unmarshal failed:', e.message);
            console.error('Ensure that: 1. The webhook secret exactly matches your Paddle dashboard. 2. You are not using a tunneling tool that modifies the JSON body.');
            return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
        }

        if (!eventData) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const userId = eventData.data?.customData?.userId;

        if (!userId) {
            // It's normal for some events or dashboard test webhooks to lack customData
            console.log(`ℹ️ Webhook ${eventData.eventType} received without userId in customData (Event ID: ${eventData.eventId || eventData.id || 'unknown'})`);
            return NextResponse.json({ message: 'No userId found' }, { status: 200 });
        }

        // Handle specific event types
        switch (eventData.eventType) {
            case 'subscription.created':
            case 'subscription.updated':
            case 'subscription.activated': {
                const sub = eventData.data as any;
                const activeStatuses = ['active', 'trialing'];
                const updateData: any = {
                    isPro: activeStatuses.includes(sub.status),
                    status: sub.status as any,
                    paddleCustomerId: sub.customerId,
                    paddleSubscriptionId: sub.id,
                };
                if (sub.nextBillDate) updateData.renewsAt = new Date(sub.nextBillDate);

                console.log(`[Paddle Webhook] Upgrading user ${userId}. Paddle Status: ${sub.status}, isPro: ${updateData.isPro}`);
                await db.collection('users').doc(userId).set({ subscription: updateData }, { merge: true });
                console.log(`[Paddle Webhook] Finished updating Firebase (Admin) for ${userId}`);
                break;
            }
            case 'subscription.canceled': {
                const sub = eventData.data as any;
                const updateData: any = {
                    isPro: false,
                    status: 'cancelled',
                    paddleCustomerId: sub.customerId,
                    paddleSubscriptionId: sub.id,
                };
                if (sub.canceledAt) updateData.endsAt = new Date(sub.canceledAt);

                console.log(`[Paddle Webhook] Processing cancellation for user ${userId}`);
                await db.collection('users').doc(userId).set({ subscription: updateData }, { merge: true });
                break;
            }
            // Add other event types as needed
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Paddle webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
