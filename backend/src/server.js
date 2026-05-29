import app from './index.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { registerRepeatableJobs } from '../src/queues/registerRepeatableJobs.js';

dotenv.config();

await connectDB();
await registerRepeatableJobs();

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port https://localhost:${port}`);
});

