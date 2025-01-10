// /config/redisConfig.js
const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

// Create Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || null, // Optional password
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

module.exports = redisClient;
