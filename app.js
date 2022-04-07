const express = require('express');
const app = express();
const chalk = require('chalk');
const ejs = require('ejs');
const debug = require('debug')('app');
const PORT = process.env.PORT || 4000;
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const webController = require('./webController.js')

// APP.GET SECTION

app.get('/index', (require, response) => {
    response.render('index', {message: ''});
});
app.get('/register', (requireuest, response) => {
    response.render('register', {message: ''});
});
app.get('/username', (require, response) => {
    response.render('username');
});
app.get('/password', (require, response) => {
    response.render('password');
});
app.get('/loggedin', webController.processUserNotLoggedIn);
app.get('/edituser', webController.processEditUser);
app.get('/admin', webController.processAdmin);
app.get('/loggedout', webController.processLogOut);

// APP.USE SECTION

app.use(bodyParser.urlencoded(({
    extended:false
})));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// APP.SET SECTION

app.set('views', 'views');
app.set('view engine', 'ejs');

// APP.POST SECTION ---

app.post('/register', webController.processRegisterUser);
app.post('/loggedin',  webController.processLoginUser);
app.post('/edituser', webController.processUpdateEditUser);
app.post('/deleteUser', webController.processDeleteUser);
app.post('/makeAdmin', webController.processMakeAdmin);
app.post('/removeAdmin', webController.processRemoveAdmin);

// APP.LISTEN SECTION

app.listen(4000, function() {
    console.log(`Running on port ${chalk.green(PORT)}`);
})