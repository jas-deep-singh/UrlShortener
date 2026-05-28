import express from 'express';

const app = express();
app.use(express.json());

import urlRoutes from './routes/url.routes.js';
app.use('/api/v1', urlRoutes);

export default app;