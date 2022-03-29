const client = require('./db');

const createDbUser = ({username, password}) => {
    let tableName = 'mytable';
    return client.query(
        `INSERT INTO ${tableName} (username, password) VALUES ('${username}', '${password}')`,
    );
}

const getUsernameAndPassword = ({username}) => {
    let tableName = 'mytable';
    return client.query(
        `SELECT id, password, isadmin FROM ${tableName} WHERE username = '${username}'`,
    );
}

const getUserProfileDetails = ({uid}) => {
    let tableName = 'mytable';
    return client.query(
        `SELECT * FROM ${tableName} WHERE id = ${uid}`
    );

}

const updateUserDetails = ({uid, password}) => {
    let tableName = 'mytable';
    return client.query(
        `UPDATE "${tableName}" SET password = '${password}' WHERE id = ${uid} AND password != '${password}'`
    );
}

const getAdminUsers = () => {
    let tableName = 'mytable';
    return client.query(
        `SELECT * FROM "${tableName}"`
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
