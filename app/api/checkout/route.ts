import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth } from '@/lib/firebase-admin';
import { initLemonSqueezy } from '@/lib/lemon-squeezy';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

initLemonSqueezy();

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
        const userEmail = user.email;

        // 2. Get variant ID from env
        const variantId = process.env.LEMON_SQUEEZY_VARIANT_ID;
        const storeId = process.env.LEMON_SQUEEZY_STORE_ID;

        if (!variantId || !storeId) {
            console.error('Lemon Squeezy environment variables are missing');
            return NextResponse.json({ error: 'Billing configuration error' }, { status: 500 });
        }

        // 3. Create Checkout Session
        // We pass the userId in the custom data to identify the user in the webhook
        const { data, error } = await createCheckout(storeId, variantId, {
            checkoutData: {
                email: userEmail,
                custom: {
                    user_id: userId,
                },
            },
            productOptions: {
                redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
            },
        });

        if (error) {
            console.error('Lemon Squeezy checkout error:', error);
            return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            url: data?.data.attributes.url
        });

    } catch (error) {
        console.error('Checkout API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
