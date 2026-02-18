import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateSubscriptionStatus } from '@/lib/firestore';

export async function POST(request: NextRequest) {
    try {
        const rawBody = await request.text();
        const signature = request.headers.get('x-signature') || '';

        // 1. Verify Webhook Signature
        const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
        if (!secret) {
            console.error('LEMON_SQUEEZY_WEBHOOK_SECRET is not defined');
            return NextResponse.json({ error: 'Config error' }, { status: 500 });
        }

        const hmac = crypto.createHmac('sha256', secret);
        const digest = hmac.update(rawBody).digest('hex');

        if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;
        const userId = payload.meta.custom_data.user_id;

        if (!userId) {
            console.error('No userId found in webhook payload');
            return NextResponse.json({ error: 'Data error' }, { status: 400 });
        }

        console.log(`Processing Lemon Squeezy event: ${eventName} for user: ${userId}`);

        // 2. Handle Subscription Events
        if (
            eventName === 'subscription_created' ||
            eventName === 'subscription_updated' ||
            eventName === 'subscription_resumed'
        ) {
            const attributes = payload.data.attributes;
            const status = attributes.status; // active, cancelled, expired, etc.

            await updateSubscriptionStatus(userId, {
                isPro: status === 'active',
                status: status,
                lemonSqueezyCustomerId: String(attributes.customer_id),
                lemonSqueezySubscriptionId: String(payload.data.id),
                renewsAt: attributes.renews_at ? new Date(attributes.renews_at) : undefined,
                endsAt: attributes.ends_at ? new Date(attributes.ends_at) : undefined,
            });
        }

        if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
            const attributes = payload.data.attributes;
            await updateSubscriptionStatus(userId, {
                isPro: false,
                status: attributes.status,
                lemonSqueezyCustomerId: String(attributes.customer_id),
                lemonSqueezySubscriptionId: String(payload.data.id),
                endsAt: attributes.ends_at ? new Date(attributes.ends_at) : undefined,
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
