var sqlMap = {
    user: {
        add: 'insert into user (username, account, password, email, phone, birth, sex) values (?,?,?,?,?,?,?,?,?)',
        select_name: 'select * from user', 
        update_user: 'update user set'
    },
    admin: {
        add: 'insert into user (a_account, password, phone, createTime, status, permission) values (?,?,?,?,?,?,?,?,?)',
        select_name: 'select * from user', 
        update_user: 'update user set'
    }
}

module.exports = sqlMap;