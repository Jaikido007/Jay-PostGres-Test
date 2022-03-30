const bcrypt = require('bcrypt');
const saltRounds = 4;

const encryptPassword = (password) => {
    let encryptedPW = bcrypt.hash(password, saltRounds)
    return encryptedPW;
}

const checkEncryptedPassword = ({enteredPW, encryptedPW}) => {
    return bcrypt.compare(enteredPW, encryptedPW);
}


module.exports = {encryptPassword, checkEncryptedPassword}