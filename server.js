const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dbConfig = require('./config/database.config.js');
const path = require('path');
const http = require('http');
dotenv.config()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.resolve("./public")));
app.use('/api',routes)
const socketapi = require("../chat-boot/src/feature/socket/socket.js");
const server = http.createServer(app);
// socketapi.io.attach(server); 
socketapi.initialize(server);
app.get('/', function (req, res) {
    return res.sendFile("/public/index.html")
})
// create mongoose instance//
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    // useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});
server.listen(3006, () => {
    console.log("Server is listening on port 3006");
});