const userApi = require('./api/userApi');
const adminApi = require('./api/adminApi');
const uploadApi = require('./api/upload');
const homeServiceApi = require('./api/homeServiceApi');
const userAppApi = require('./api/userAppApi');
const adminAppApi = require('./api/adminAppApi');
const newsApi = require('./api/newsApi');
const updatePasswordApi = require('./api/updatePasswordApi');

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const { admin } = require('./db/sqlMap');
const app = express();
var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())

app.use('/api/user', userApi);
app.use('/api/admin',adminApi)
app.use('/api/upload',uploadApi)
app.use('/api/homeService', homeServiceApi)
app.use('/api/userAppApi', userAppApi)
app.use('/api/adminAppApi', adminAppApi)
app.use('/api/newsApi', newsApi)
app.use('/api/updatePassword', updatePasswordApi)

app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));

app.use('/public', express.static('public'));
// app.use('/public', express.static('public'));

// app.listen(3000);
// console.log('success listen at port: 3000')
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://localhost:%s', port);
});
