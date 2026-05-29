import { createShortCode, redirectToOriginalUrl, getUrlAnalytics } from '../controllers/url.controllers.js';
import { Router } from 'express';
import createUrlRateLimiter from '../middlewares/rateLimiter.middlewares.js';

const router = Router();

router.route('/shortenURL').post(createUrlRateLimiter, createShortCode);
router.route('/:shortCode').get(redirectToOriginalUrl);
router.route('/:shortCode/analytics').get(getUrlAnalytics);

export default router;