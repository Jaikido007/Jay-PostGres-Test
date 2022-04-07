const {createDbUser, getUsernameAndPassword, getUserProfileDetails, updateUserDetails, getAdminUsers, deleteUser, makeUserAdmin, removeUserAdmin} = require('./webDatabaseController.js')
const appUser = require('./user.js')
const {encryptPassword, checkEncryptedPassword} = require('./passwords.js')
const {dbErrorHandle} = require('./db_error_handling')
const superUser = require('./superuser')
let myUser = new appUser;
let mySuperUser = new superUser;

// PROCESS SECTION

const processRegisterUser = (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    encryptPassword(password)
    .then(result => {
        createDbUser({username, password, result})
        .then(() => response.render('index', {message: ''}))
        .catch(error => {
            let dbError = dbErrorHandle(error.constraint);
            response.render('register', {message: dbError})
        })
    }) //WHY?
    .catch(error => {
        response.status(500).send(error);
    })
   
};

const processLoginUser = (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    
    getUsernameAndPassword ({username})
    .then((result) => {
        let data = result;
        if (result.rowCount ==0) {
            response.render('index', {message: 'Invalid Username or Password'});
        } else {
            let encryptedpw = result.rows[0].encryptedpw;
            checkEncryptedPassword({password, encryptedpw})
            .then(result => {
                console.log(result)
            if (result === true){
                myUser.setUid = data.rows[0].id;
                mySuperUser.setUid = data.rows[0].id;
                myUser.setUsername = username;
                myUser.setPassword = password;
                myUser.setIsadmin = data.rows[0].isadmin;
                console.table(mySuperUser);
                if (myUser.getIsadmin === 'Y') {
                    response.render('loggedin', {uname: username, admin: '<a href="/admin">Admin</a>'});
                } else {
                    response.render('loggedin', {uname: username, admin:''});
                }  

        } else {
            response.render('index', {message: 'Invalid Username or Password'});
                }
            })
            // .catch(() => response.status(500).send('error123'))
            }
        })
    .catch(() => {
        response.render('index', {message: 'Invalid Username or Password'});
    })
}

const processUserNotLoggedIn = (request, response) => {
    if (myUser.getUid != '') {
        response.render('index', {message: 'Permission denied!'});
    } else {
        response.render('loggedin');
}
}

const processLogOut = (request, response) => {
    myUser.setUid = '';
    myUser.setUsername = '';
    myUser.setIsadmin = '';
    myUser.setPassword = '';
    response.render('index', {message: ''});
}

const processEditUser = (request, response) => {
    const uid = myUser.getUid;
    getUserProfileDetails({uid})
    .then((result) => {
        if(myUser.getIsadmin == 'Y') {
            response.render('edituser', {uname: result.rows[0].username, password: result.rows[0].encryptedpw, admin: '<a href="/admin">Admin</a>'});
        } else {
            response.render('edituser', {uname: result.rows[0].username, password: result.rows[0].encryptedpw, admin: ''});
        }
    })
    .catch(() => response.render('index', {message: 'Permission denied!'}));
}

const processUpdateEditUser = (request, response) => {
    let uid = myUser.getUid;
    let username = myUser.getUsername;
    let password = request.body.password;
    encryptPassword(password)
    .then(result => { 
        console.log(result)
        updateUserDetails({uid, result})
        .then(() => response.render('index', {message: ''}))
        .catch(() => response.status(500).send('error'));
}) .catch(() => response.status(500).send('error'));
}

const processAdmin = (request, response) => {
    let isadmin = myUser.getIsadmin;
    console.log(isadmin);
    if(typeof isadmin !== 'undefined') {
    isadmin = isadmin.trim();}
    if(isadmin != 'Y') {
        response.render('index', {message: 'Permission denied!'});
    } else { 
    let username = myUser.getUsername;
    getAdminUsers()
    .then((result) => {
        let data = result.rows;
        response.render('admin', {data, uname: username});
    })
    .catch(() => response.status(500).send('error'));
}
}

// PROCESSES IN FOOTER

const processDeleteUser = (request, response) => {
    let uid = request.body.hiddenId;
    deleteUser(uid)
    .then(() => processAdmin(request, response))
    .catch(() => response.status(500).send('error'));
}

const processMakeAdmin = (request, response) => {
    let uid = request.body.hiddenAdminId;
    makeUserAdmin(uid)
    .then(() => processAdmin(request, response))
    .catch(() => response.status(500).send('error'));
}

const processRemoveAdmin = (request, response) => {
    let uid = request.body.hiddenRemoveAdminId;
   removeUserAdmin(uid)
    .then(() => processAdmin(request, response))
    .catch(() => response.status(500).send('error'));
}

// MODULES

module.exports = {
    processRegisterUser,
    processLoginUser,
    processEditUser,
    processUpdateEditUser,
    processLogOut,
    processAdmin,
    processDeleteUser,
    processMakeAdmin ,
    processRemoveAdmin,
    processUserNotLoggedIn
}
