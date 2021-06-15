export const config = Object.freeze({
    TOKEN_LIFESPAN:  7 * 86400, // 7 days * 86400 seconds a day
    SECRET_KEY: process.env.SECRET_KEY || 'secret', // Only use the secret fallback in development
});