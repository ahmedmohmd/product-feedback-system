import * as dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "..", "..", "config", ".env") });

const DB_URL: string = process.env.DATABASE_CONNECTION_URL as string;

const connect = () => {
  return mongoose.connect(DB_URL);
};

export default connect;
