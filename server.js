const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dbConfig = require('./config/database.config.js');
dotenv.config()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    // useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});
app.use('/api',routes)
app.listen(3006, () => {
    console.log("Server is listening on port 3006");
});