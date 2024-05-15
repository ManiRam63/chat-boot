import mongoose from "mongoose";
import logger from "../utils/logger";
export default async function connectDatabase(): Promise<void> {
    mongoose
        .connect(process.env.DB_URL, {})
        .then(() => {
            console.log('Database Connected Successfully!!');
        })
        .catch((err) => {
            logger.error('Could not connect to the database', {
                meta: err
            });
        });
}
