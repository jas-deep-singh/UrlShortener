import { analyticsQueue } from '../queues/analytics.queue.js';

const registerRepeatableJobs = async() => {
    await analyticsQueue.add(
        'sync-clicks',
        {},
        {
            jobId: 'sync-clicks-job',
            repeat: {
                every: 5000
            },
            removeOnComplete: true,
            removeOnFail: true
        }
    );
}

export { registerRepeatableJobs };
