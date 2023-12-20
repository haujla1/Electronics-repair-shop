export const mongoConfig = {
  serverUrl: process.env.MONGO_SERVER_URL || "mongodb://127.0.0.1:27017/",
  database: process.env.MONGO_DATABASE || "Electronics-Repair-Shop",
};
