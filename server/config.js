const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    IAPI: process.env.IAPI,
    environment: process.env.NODE_ENV,
    FIREBASE_KEY: process.env.FIREBASE_KEY,
    DOMAIN: process.env.DOMAIN,
    BEARER_TOKEN: process.env.BEARER_TOKEN,
    SOCKET: process.env.SOCKET,
    LOGIN_URL: process.env.LOGIN_URL,
    THECUATUI_IAPI: process.env.THECUATUI_IAPI,
    CHAT_URL: process.env.CHAT_URL
};