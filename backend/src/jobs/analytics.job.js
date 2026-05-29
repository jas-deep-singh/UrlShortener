import { analyticsQueue } from '../queues/analytics.queue.js';

const addAnalyticsJob = async(data) => {
    const job = await analyticsQueue.add('sync-clicks', data, {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    });
    console.log('Job added to queue:', job.id);
    return job;
}

export { addAnalyticsJob };