const dbErrorHandle = (dbError) => {
    switch(dbError) {
        case 'unique_user':return 'Sorry, that username already exists.';
        break;
        default:return 'Unhandled datbase error!';
    }
}

module.exports = {dbErrorHandle};