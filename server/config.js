const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    IAPI: process.env.IAPI,
    environment: process.env.NODE_ENV,
    FIREBASE_KEY: process.env.FIREBASE_KEY,
    DOMAIN: process.env.DOMAIN
};