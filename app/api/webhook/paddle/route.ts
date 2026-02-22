// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { paddle } from '@/lib/paddle';
import { updateSubscriptionStatus } from '@/lib/firestore';

export async function POST(request: NextRequest) {
    const signature = request.headers.get('paddle-signature') || '';
    const body = await request.text();

    try {
        const secret = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET || '';

        // Verify the webhook signature
        const eventData: any = await paddle.webhooks.unmarshal(body, secret, signature);

        if (!eventData) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const userId = eventData.data?.customData?.userId;

        if (!userId) {
            console.warn('Webhook received without userId in customData', eventData.eventId || eventData.id);
            return NextResponse.json({ message: 'No userId found' }, { status: 200 });
        }

        // Handle specific event types
        switch (eventData.eventType) {
            case 'subscription.created':
            case 'subscription.updated':
            case 'subscription.activated': {
                const sub = eventData.data as any;
                await updateSubscriptionStatus(userId, {
                    isPro: sub.status === 'active',
                    status: sub.status as any,
                    paddleCustomerId: sub.customerId,
                    paddleSubscriptionId: sub.id,
                    renewsAt: sub.nextBillDate ? new Date(sub.nextBillDate) : undefined,
                });
                break;
            }
            case 'subscription.canceled': {
                const sub = eventData.data as any;
                await updateSubscriptionStatus(userId, {
                    isPro: false,
                    status: 'cancelled',
                    paddleCustomerId: sub.customerId,
                    paddleSubscriptionId: sub.id,
                    endsAt: sub.canceledAt ? new Date(sub.canceledAt) : undefined,
                });
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
