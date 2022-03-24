const express = require('express');
const chalk = require('chalk');
const app = express();
const ejs = require('ejs');
const debug = require('debug')('app');
const PORT = process.env.PORT || 4000;
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const client = require('./db');
const cookieParser = require('cookie-parser');
const appuser = require('./user.js')

app.use(cookieParser());

let myUser = new appuser;

// APP.GET SECTION

app.get('/index', (req, res) => {
    res.render('index', {message: ''});
});
app.get('/register', (req, res) => {
    res.render('register', {message: ''});
});
app.get('/username', (req, res) => {
    res.render('username');
});
app.get('/password', (req, res) => {
    res.render('password');
});
app.get('/loggedin', (req, res) => {
    if (myUser.getUid != '') {
        res.render('index', {message: ''});
    } else {
    res.render('loggedin');
}});
app.get('/edituser', (req, res) => {
    editUserProfile(req, res);
});
app.get('/admin', (req, res) => {
    processAdmin(req, res);
});
app.get('/loggedout', (req, res) => {
    processLoggedout(req, res);
});
// app.get('/test', (req, res) => {
//     client.query('SELECT * FROM "mytable"', 
//     (error, result) => {
//         if (error) {
//             console.log(error);
//             res.status(400).send(error);
//         }
//         // res.status(200).send(result.rows);
//     });
// })

// APP.USE SECTION

app.use(bodyParser.urlencoded(({
    extended:false
})));

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


// APP.SET SECTION

app.set('views', 'views');

app.set('view engine', 'ejs');

// APP.POST SECTION

app.post('/register2', (req, res, next) => {
    processRegister(req.body, res);
});

app.post('/loggedin', (req, res, next) => {
    processLoggedin(req.body, res);
});

app.post('/edituser', (req, res, next) => {
    updateEditUser(req, req.body, res);
})
app.post('/deleteUser', (req, res, next) => {
    processDeleteUser(req, req.body, res);
})

app.post('/makeAdmin', (req, res, next) => {
    processMakeAdmin(req, req.body, res);
})

app.post('/removeAdmin', (req, res, next) => {
    processRemoveAdmin(req, req.body, res);
})


// APP.LISTEN SECTION

app.listen(4000, function() {
    console.log(`Running on port ${chalk.green(PORT)}`);
})

// FUNCTIONS SECTION

function processLoggedin(params, res) {
    let u = params.username;
    let p = params.password;
    console.log(u + p);
    let tableName = 'mytable';
    client.query(`SELECT id, password, isadmin FROM ${tableName} WHERE username = '${u}'`,
    (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).send(error); 
        } else {
            if (result.rowCount ==0) {
                res.render('index', {message: 'Invalid Username or Password'});
            } else {
            if (result.rows[0].password === p){
                myUser.setUid = result.rows[0].id;
                myUser.setUsername = u;
                myUser.setPassword = result.rows[0].password;
                myUser.setIsadmin = result.rows[0].isadmin;
                console.table(myUser);

                // res.cookie('username', u);
                // res.cookie("uid", result.rows[0].id);
                // res.render('loggedin', {uname: u});
                // res.cookie('isadmin', result.rows[0].isadmin);
                    if (result.rows[0].isadmin === 'Y') {
                        res.render('loggedin', {uname: u, admin: '<a href="/admin">Admin</a>'});
                    } else {
                        res.render('loggedin', {uname: u, admin:''});} 

            } else {
                res.render('index', {message: 'Invalid Username or Password'});
        }
        }
    }
        });
} 

function processLoggedout(req, res) {
    // res.clearCookie('username');
    // res.clearCookie('uid');
    // res.clearCookie('isadmin');
    myUser.setUid = '';
    res.render('index', {message: ''});
};


function processRegister(params, res){
    let u = params.username;
    let p = params.password;
    console.log(u + p);
    let tableName = 'mytable';
    client.query(`INSERT INTO ${tableName} (username, password) VALUES ('${u}', '${p}')`,
    (error, result) => {
        if(error) {
       
        console.log(error);
        // res.status(500).send(error);
    }
        res.render('index', {message: ''});
    });
}

function editUserProfile(req, res){
    const uid = myUser.getUid;

    // let uid = req.cookies.uid;
    console.table(myUser);
    let tableName = 'mytable';
    let query = `SELECT * FROM ${tableName} WHERE id = ${uid}`;
    client.query(query,
        (error, result) => {
            if(error){
                console.log(error);
                res.status(500).send(error);
            } else {
                if(myUser.getIsadmin == 'Y') {
                    res.render('edituser', {uname: result.rows[0].username, password: result.rows[0].password, admin: '<a href="/admin">Admin</a>'});
                } else {
                    res.render('edituser', {uname: result.rows[0].username, password: result.rows[0].password, admin: ''});
                }
                
            }
        })
}
// if (result.rows[0].isadmin === 'Y') {
//     res.render('loggedin', {uname: u, admin: '<a href="/admin">Admin</a>'});
// } else {
//     res.render('loggedin', {uname: u, admin:''});} 

// }




function updateEditUser(req, params, res) {

    const uid = myUser.getUid;
    const u = myUser.getUsername;
    // let uid = req.cookies.uid;
    // let u = req.cookies.username;
    const p = params.password;
    let tableName = 'mytable';
    client.query(`UPDATE "${tableName}" SET password = '${p}' WHERE id = ${uid} AND password != '${p}'`,
        (error, result) => {
            if(error){
                console.log(error);
                res.status(500).send(error);
            } else {
                res.render('index', {message: ''})}
            });
}

function processAdmin(req, res){
    console.table(myUser);
    console.log(myUser.getIsadmin);
    let isadmin = myUser.getIsadmin;
    isadmin = isadmin.trim();
    if(isadmin != 'Y') {
        console.log('not admin')
        res.render('index', {message: ''});
    } else { 
        console.log('isadmin');
    let tableName = 'mytable';
    let myQuery = `SELECT * FROM "${tableName}"`
    let u = myUser.getUsername;
    // let u = req.cookies.username;
    client.query(myQuery,
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                //res.render('profile', {uName: result.rows[0].username, password: result.rows[0].password });
                let data = result.rows;
                res.render('admin', {data, uname: u});
            }
        });
    }
}

// FOOTER FUNCTIONS

function processDeleteUser(req, params, res) {
    let uid = params.hiddenId;
    let tableName = 'mytable';
    let myQuery = `DELETE FROM "${tableName}" WHERE id = ${uid}`
    client.query(myQuery,
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                processAdmin(req, res);
            }
        });
}

function processMakeAdmin(req, params, res) {
    let uid = params.hiddenAdminId;
    let tableName = 'mytable';
    let myQuery = `UPDATE "${tableName}" SET isadmin = 'Y' WHERE id = ${uid}`
    client.query(myQuery,
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                processAdmin(req, res);
            }
        });
}

function processRemoveAdmin(req, params, res) {
    let uid = params.hiddenRemoveAdminId;
    let tableName = 'mytable';
    let myQuery = `UPDATE "${tableName}" SET isadmin = 'N' WHERE id = ${uid}`
    client.query(myQuery,
        (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                processAdmin(req, res);
            }
        });
}