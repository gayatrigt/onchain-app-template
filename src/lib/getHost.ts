export const getHost = () => {
    return process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000';
}