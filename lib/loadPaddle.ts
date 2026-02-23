export async function loadPaddle(): Promise<any> {
    if (typeof window === 'undefined') return null;
    // @ts-ignore
    if (window.Paddle) return window.Paddle;

    return new Promise((resolve, reject) => {
        try {
            const s = document.createElement('script');
            s.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
            s.async = true;
            s.onload = () => {
                // @ts-ignore
                resolve(window.Paddle);
            };
            s.onerror = (err) => reject(err);
            document.head.appendChild(s);
        } catch (err) {
            reject(err);
        }
    });
}
