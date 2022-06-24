import mongoose from "mongoose";
import config from './config'

(async () => {
  try {
    const db = await mongoose.connect(`${config.MONGODB_URI}`);
    console.log("Database is connected:", db.connection.name);
  } catch (error) {
    console.log(error);
  }
})();
