import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import redis from '../config/redis.js';

const createUrlRateLimiter = rateLimit({
    windowMs: 60*1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    },
    store: new RedisStore({
        sendCommand: (...args) => redis.call(...args)
    })
});

export default createUrlRateLimiter;