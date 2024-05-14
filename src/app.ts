import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dbConfig from './config/index';
import path from 'path';
import http from 'http';
dotenv.config();
import { initialize } from '../src/features/socket/socket';
import logger from './utils/logger';
const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve('./public')));
app.use('/api', router);
app.get('/', (req, res) => {
  return res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});
initialize(server);
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.url, {})
  .then(() => {
    console.log('Database Connected Successfully!!');
  })
  .catch((err) => {
    logger.error('Could not connect to the database', {
      meta: err
    });
    process.exit(1);
  });

server.listen(3006, () => {
  console.log('Server is listening on port 3006');
});
