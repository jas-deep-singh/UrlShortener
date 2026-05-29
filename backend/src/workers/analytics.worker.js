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
        const { shortCode } = job.data;
        console.log(`Processing job for shortcode: ${shortCode}`);
        const clickKey = `clicks:${shortCode}`;
        const clicks = await redis.get(clickKey);
        if(!clicks) {
            console.log(`No clicks found for shortcode: ${shortCode}`);
            return;
        }
        const clickCount = Number(clicks);
        await URL.updateOne(
            { shortCode },
            { $inc: 
                { clicks: clickCount } 
            }
        );
        console.log(`MongoDb clicks updated for ${shortCode} with ${clickCount}`);
        await redis.del(clickKey);
        console.log(`Redis click key deleted for ${shortCode}`);
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