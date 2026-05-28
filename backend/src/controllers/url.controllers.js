import { URL } from '../models/url.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiResponse } from '../utils/apiResponse.js';
import { apiError } from '../utils/apiError.js';
import generateShortCode from '../utils/generateShortCode.js';
import redis from '../config/redis.js';

const createShortCode = asyncHandler(async(req, res) => {
    const { originalUrl } = req.body;
    if(!originalUrl) {
        throw new apiError(400, 'Original URL is required');
    }
    const shortCode = generateShortCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    const url = await URL.create({
        originalUrl,
        shortCode,
        expiresAt
    });
    res.status(201).json(new apiResponse(201, 'Short URL created successfully', `${process.env.BASE_URL}/${shortCode}`));
});

const redirectToOriginalUrl = asyncHandler(async(req, res) => {
    const { shortCode } = req.params;
    if(!shortCode) {
        throw new apiError(400, 'Short code is required');
    }
    const cacheKey = `url:${shortCode}`;
    const clickKey = `clicks:${shortCode}`;
    const cachedUrl = await redis.get(cacheKey);
    if(cachedUrl) {
        console.log('Cache hit for short code:', shortCode);
        await redis.incr(clickKey);
        return res.redirect(cachedUrl);
    }
    console.log('Cache miss for short code:', shortCode);
    const url = await URL.findOne({ shortCode });
    if(!url) {
        throw new apiError(404, 'Short URL not found');
    }
    if(url.expiresAt < new Date()) {
        throw new apiError(410, 'Short URL has expired');
    }
    await redis.set(cacheKey, url.originalUrl, 'EX', 60 * 60 * 24);
    await redis.set(clickKey, url.clicks || 0);
    await redis.incr(clickKey);
    return res.redirect(url.originalUrl);
});

const getUrlAnalytics = asyncHandler(async(req, res) => {
    const { shortCode } = req.params;
    if(!shortCode) {
        throw new apiError(400, 'Short code is required');
    }
    const url = await URL.findOne({ shortCode }).lean();
    if(!url) {
        throw new apiError(404, 'Short URL not found');
    }
    const expiry = url.expiresAt.toISOString().split('T');
    return res.status(200).json(new apiResponse(200, 'URL analytics retrieved successfully', {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clicks: url.clicks,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt,
        isExpired: url.expiresAt < new Date(),
        expiryDate: expiry[0],
        expiryTime: expiry[1].split('.')[0]
    }));
});

export { createShortCode, redirectToOriginalUrl, getUrlAnalytics };