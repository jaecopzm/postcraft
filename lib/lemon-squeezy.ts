import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

/**
 * Initialize Lemon Squeezy SDK with the API key from environment variables.
 */
export function initLemonSqueezy() {
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    if (!apiKey) {
        console.error('LEMON_SQUEEZY_API_KEY is not defined');
        return;
    }

    lemonSqueezySetup({
        apiKey,
        onError: (error) => {
            console.error('Lemon Squeezy SDK error:', error);
        },
    });
}
