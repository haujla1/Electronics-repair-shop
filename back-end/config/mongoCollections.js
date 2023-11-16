import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

export const technicians = getCollectionFn("technicians");
export const admins = getCollectionFn("admins");
export const clients = getCollectionFn("clients");
