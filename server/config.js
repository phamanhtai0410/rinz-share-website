const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    IAPI: process.env.IAPI,
    environment: process.env.NODE_ENV
};