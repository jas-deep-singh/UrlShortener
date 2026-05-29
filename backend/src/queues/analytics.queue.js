import { Queue } from 'bullmq';

const connection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
}

const analyticsQueue = new Queue('analyticsQueue', { connection });

export { connection, analyticsQueue };