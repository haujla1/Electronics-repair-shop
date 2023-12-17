import redis from "redis";

const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
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
