var models = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var conn = mysql.createConnection(models.mysql);

conn.connect();

var jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.send('err');
    } else {
        console.log(ret);
        res.send(ret);
    }
}

var dateStr = function (str) {
    return new Date(str.slice(0, 7));
}

// 查找管理员个人的信息
router.post('/findAdminInfo', (req, res) => {
    const params = [req.body.a_id]
    let sql = "select * FROM admin where  id= ?"
    const isNoSelect = []
    conn.query(sql,params, (err, result) => {
        if (err) {
            console.log(err);
        }
        // console.log(result);
        if (result[0] === undefined) {
            res.send(isNoSelect)   //查询不出username，data 返回-1
        } else {
            jsonWrite(res, result);
        }
    })
});

// 查找管理密码是否正确
router.post('/findAdminIsok', (req, res) => {
    const params = [req.body.password, req.body.a_id]
    let sql = "select password FROM admin where  password = ? and id= ?"
    const isNoSelect = []
    conn.query(sql,params, (err, result) => {
        if (err) {
            console.log(err);
        }
        // console.log(result);
        if (result[0] === undefined) {
            res.send(isNoSelect)   //查询不出username，data 返回-1
        } else {
            jsonWrite(res, result);
        }
    })
});

// 修改管理员密码
router.put('/updateAdminPassword', (req, res) => {
    const params = [req.body.newPassword, req.body.a_id]
    console.log(params);
    const sql_update = 'update admin set password =? where id= ? '
    conn.query(sql_update,params, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            res.json({
                code: 200,
                msg: "修改成功，请重新登录",
            });
        }
    })
})

// 查找用户个人的信息
router.post('/findUserInfo', (req, res) => {
    console.log(req.body);
    const params = [req.body.u_id]
    let sql = "select * FROM user where  id= ?"
    const isNoSelect = []
    conn.query(sql,params, (err, result) => {
        if (err) {
            console.log(err);
        }
        // console.log(result);
        if (result[0] === undefined) {
            res.send(isNoSelect)   //查询不出username，data 返回-1
        } else {
            jsonWrite(res, result);
        }
    })
});

// 查找用户码是否正确
router.post('/findUserIsok', (req, res) => {
    const params = [req.body.password, req.body.u_id]
    let sql = "select * FROM user where  password = ? and id= ?"
    const isNoSelect = []
    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
        }
        // console.log(result);
        if (result[0] === undefined) {
            res.send(isNoSelect)   //查询不出username，data 返回-1
        } else {
            jsonWrite(res, result);
        }
    })
});

// 修改用户密码
router.put('/updateUserPassword', (req, res) => {
    const params = [req.body.newPassword, req.body.u_id]
    console.log(params);
    const sql_update = 'update user set password =? where id= ? '
    conn.query(sql_update,params, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            res.json({
                code: 200,
                msg: "修改成功，请重新登录",
            });
        }
    })
})


module.exports = router;