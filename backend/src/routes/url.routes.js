import { createShortCode, redirectToOriginalUrl, getUrlAnalytics } from '../controllers/url.controllers.js';
import { Router } from 'express';

const router = Router();

router.route('/shortenURL').post(createShortCode);
router.route('/:shortCode').get(redirectToOriginalUrl);
router.route('/:shortCode/analytics').get(getUrlAnalytics);

export default router;