import { nanoid } from 'nanoid';

function generateShortCode() {
    const shortCode = nanoid(6);
    return shortCode;
}

export default generateShortCode;