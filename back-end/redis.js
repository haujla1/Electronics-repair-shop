import redis from "redis";
import "dotenv/config";

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisClient.on("ready", () => {
  console.log("Redis client is ready");
});
redisClient.on("connect", () => {
  console.log("Redis client is connected");
});
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
await redisClient.connect();

export { redisClient };
