const client = require('./db');

const createDbUser = ({username, password, result}) => {
    let tableName = 'mytable';
    return client.query(
        `INSERT INTO ${tableName} (username, password, encryptedpw) VALUES ('${username}', '${password}', '${result}')`,
    );
}

const getUsernameAndPassword = ({username}) => {
    let tableName = 'mytable';
    return client.query(
        `SELECT id, password, isadmin, encryptedpw FROM ${tableName} WHERE username = '${username}'`,
    );
}

const getUserProfileDetails = ({uid}) => {
    let tableName = 'mytable';
    return client.query(
        `SELECT * FROM ${tableName} WHERE id = ${uid}`
    );

}

const updateUserDetails = ({uid, password, result}) => {
    let tableName = 'mytable';
    console.log(result)
    return client.query(
        `UPDATE "${tableName}" SET (encryptedpw, password) = ('${result}', '${password}') WHERE id = ${uid}` 
        // AND encryptedpw != '${result}'

    );
}

const getAdminUsers = () => {
    let tableName = 'mytable';
    return client.query(
        `SELECT id, username, password, isadmin, '********' AS password FROM "${tableName}"`
    );
}

const deleteUser = (uid) => {
    let tableName = 'mytable';
    return client.query (
    `DELETE FROM "${tableName}" WHERE id = ${uid}`
    );
}

const makeUserAdmin = (uid) => {
    let tableName = 'mytable';
    return client.query(
        `UPDATE "${tableName}" SET isadmin = 'Y' WHERE id = ${uid}`
    );
}

const removeUserAdmin = (uid) => {
    let tableName = 'mytable';
    return client.query(
        `UPDATE "${tableName}" SET isadmin = 'N' WHERE id = ${uid}`
    );
}

// MODULES

module.exports = {
    createDbUser,
    getUsernameAndPassword,
    getUserProfileDetails,
    updateUserDetails,
    getAdminUsers,
    deleteUser,
    makeUserAdmin,
    removeUserAdmin,

}
