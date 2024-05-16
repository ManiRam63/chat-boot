import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';
import dotenv from 'dotenv';
import http from 'http';
import database from './config/index';
import initialize from './features/socket/socket';
dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', router);
database()
initialize(server);
server.listen(process.env.PORT, () => {
    console.log('Server is listening on port 3006');
});
