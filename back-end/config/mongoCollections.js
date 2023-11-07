import {dbConnection} from './mongoConnection.js';

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

/* Now, you can list your collections here: 
NOTE: YOU WILL NEED TO CHANGE THE CODE BELOW AND UNCOMMENT IT TO HAVE THE COLLECTION(S) REQUIRED BY THE ASSIGNMENT */

export const technicians = getCollectionFn('technicians');
export const admins = getCollectionFn('admins');
export const clients = getCollectionFn('clients');

