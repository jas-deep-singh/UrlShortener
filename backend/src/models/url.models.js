import mongoose from 'mongoose';

const UrlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true
        },
        shortCode: {
            type: String,
            unique: true,
            required: true,
            index: true
        },
        clicks: {
            type: Number,
            default: 0
        },
        expiresAt: {
            type: Date, 
            required: true,
            expires: 0
        }
    },
    {
        timestamps: true
    }
);

export const URL = mongoose.model('URL', UrlSchema);