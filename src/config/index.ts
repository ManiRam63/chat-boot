import dotenv from 'dotenv';
dotenv.config();
const dbConfig = {
  url: process.env.DB_URL
};
export default dbConfig;
