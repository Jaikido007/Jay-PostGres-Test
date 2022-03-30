const {createDbUser, getUsernameAndPassword, getUserProfileDetails, updateUserDetails, getAdminUsers, deleteUser, makeUserAdmin, removeUserAdmin} = require('./webDatabaseController.js')
const appUser = require('./user.js')
const {encryptPassword, checkEncryptedPassword} = require('./passwords.js')
let myUser = new appUser;

// PROCESS SECTION

const processRegisterUser = (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    encryptPassword(password)
    .then(result => {
        createDbUser({username, password, result})
        .then(() => response.render('index', {message: ''}))
        .catch(error => {
            if (error.constraint == 'unique_user') {
                response.render('register', {message: 'Sorry, that username already exists'})
            } else {
                response.status(500).send(error);
            }
        })
    })
    .catch(error => {
        response.status(500).send(error);
    })
   
};

const processLoginUser = (request, response) => {
    let username = request.body.username;
    let password = request.body.password;
    getUsernameAndPassword ({username})
    .then((result) => {
        if (result.rowCount ==0) {
            response.render('index', {message: 'Invalid Username or Password'});
        } else {
            if (result.rows[0].password === password){
                myUser.setUid = result.rows[0].id;
                myUser.setUsername = username;
                myUser.setPassword = result.rows[0].password;
                myUser.setIsadmin = result.rows[0].isadmin;
                console.table(myUser);
                if (result.rows[0].isadmin === 'Y') {
                    response.render('loggedin', {uname: username, admin: '<a href="/admin">Admin</a>'});
                } else {
                    response.render('loggedin', {uname: username, admin:''});
                } 

        } else {
            response.render('index', {message: 'Invalid Username or Password'});
                }
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
            response.render('edituser', {uname: result.rows[0].username, password: result.rows[0].password, admin: '<a href="/admin">Admin</a>'});
        } else {
            response.render('edituser', {uname: result.rows[0].username, password: result.rows[0].password, admin: ''});
        }
    })
    .catch(() => response.render('index', {message: 'Permission denied!'}));
}

const processUpdateEditUser = (request, response) => {
    let uid = myUser.getUid;
    let username = myUser.getUsername;
    let password = request.body.password;
    updateUserDetails({uid, password})
    .then(() => response.render('index', {message: ''}))
    .catch(() => response.status(500).send('error'));
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
