import { db } from './firebase-admin';

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Robust, persistent rate limiter for serverless environments.
 * Uses Firestore to track requests across distributed instances.
 * 
 * @param identifier - Unique key to limit (e.g., userId or IP)
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Sliding window duration in milliseconds
 */
export async function rateLimit(
  identifier: string,
  maxRequests: number = 20,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  const now = Date.now();
  const rateLimitRef = db.collection('rate_limits').doc(identifier);

  try {
    const result = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(rateLimitRef);
      const data = doc.exists ? doc.data() : { timestamps: [] };

      // Filter out timestamps outside the current window
      const validTimestamps = (data?.timestamps || []).filter(
        (ts: number) => ts > now - windowMs
      );

      if (validTimestamps.length >= maxRequests) {
        // Find the oldest valid timestamp to estimate reset time
        const oldest = validTimestamps[0];
        const resetTime = oldest + windowMs;

        return {
          success: false,
          remaining: 0,
          resetTime
        };
      }

      // Add current request
      validTimestamps.push(now);

      transaction.set(rateLimitRef, {
        timestamps: validTimestamps,
        lastUpdated: now
      });

      return {
        success: true,
        remaining: maxRequests - validTimestamps.length,
        resetTime: now + windowMs // Rough estimation for next full reset
      };
    });

    return result;
  } catch (error) {
    console.error('Rate limit transaction failed:', error);
    // Fail open in case of DB failure to avoid blocking legitimate users, 
    // but log the error for monitoring.
    return {
      success: true,
      remaining: 1,
      resetTime: now + windowMs
    };
  }
}
