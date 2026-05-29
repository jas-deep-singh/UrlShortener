import { Worker } from 'bullmq';
import { connection, analyticsQueue } from '../queues/analytics.queue.js';
import redis from '../config/redis.js';
import { URL } from '../models/url.models.js';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

connectDB();

const analyticsWorker = new Worker(
    'analyticsQueue',
    async(job) => {
        if(job.name === 'sync-clicks') {
            console.log('Starting batch flush of click counts at', new Date().toISOString());
            const bulkOps = [];
            const keys = await redis.keys('clicks:*');
            for(const key of keys) {
                const shortCode = key.split(':')[1];
                const count = await redis.get(key);
                if(Number(count)>0) {
                    bulkOps.push({
                        updateOne: {
                            filter: { shortCode },
                            update: { $inc: { clicks: Number(count) } }
                        }
                    });
                    console.log(`Flushing ${count} clicks for short code ${shortCode}`);
                    await redis.del(key);
                }
            }
            if(bulkOps.length > 0) {
                await URL.bulkWrite(bulkOps);
            }
            console.log('Batch flush completed at', new Date().toISOString());
        }
    },
    {
        connection
    }
);

analyticsWorker.on('completed', (job) => {
    console.log(`Job with ID ${job.id} has been completed`);
});

analyticsWorker.on('failed', (job, err) => {
    console.error(`Job with ID ${job.id} has failed:`, err);
});