const user = require('./user')

class superUser extends user{
constructor(uid, username, password, isadmin){
    super(uid, username, password);
    this.isadmin = isadmin
}
get getIsadmin() {
    return this.isadmin
}
set setIsadmin(isadmin) {
    this.isadmin = isadmin;
}

}

module.exports = superUser