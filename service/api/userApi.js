var models = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');

var conn = mysql.createConnection(models.mysql);

conn.connect();

var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.send('err');
    } else {
        console.log(ret);
        res.send(ret);
    }
}

var dateStr = function(str) {
    return new Date(str.slice(0,7));
}
// 注册查重
router.post('/findAccountRepeat', (req,res) => {
    let sql = 'select account FROM user where account = ?'
    let params = req.body;
    conn.query(sql,params.account, function(err, result){
        if (err) {
            console.log(err);
        }
        // console.log(result);
        if (result[0] === undefined) {
            res.send('0')   //查询不出admin，data 返回 0
        } else {
            res.send('该账户已存在，不能注册') 
        }
    })
})
// 增加用户接口
router.post('/addUser', (req, res) => {
    var params = req.body;
    const cTime = new Date()
    var sql = 'insert into user set username=? , account=?, password=?, email=?, phone=?, createTime=?, sex=?'
    var add_value = [ params.username, params.account, params.password,params.email, params.phone,cTime, params.sex]
    conn.query(sql,add_value, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            console.log(result);
            res.send('注册成功') 
        }
    })
});

// 用户登陆接口
router.post('/login', (req, res) => {
    let sql = 'select * from user where account=? and password = ?'
    // var sql_password = $sql.user.select_password;
    let params = req.body;
    const sql_select = [params.name, params.password]
        // sql_name += " where username ='"+ keywords.name +"'";
        // console.log(sql_name);

    conn.query(sql,sql_select ,function(err, result) {
        if (err) {
            console.log(err);
        }
        // console.log(result);
        if (result[0] === undefined) {
            res.send('-1')   //查询不出username，data 返回-1
        } else {
            var resultArray = result[0];
            console.log(resultArray);
            // console.log(keywords);
            if(resultArray.status === 1){
                res.send('0')   //username
            }else if (resultArray.password === params.password) {
                jsonWrite(res, result);
            }  
        }
    })
});

//获取用户信息
router.post('/getUser', (req, res) => {
    const isNoSelect = []
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    var sql = "select * from user order by username,createTime desc limit ?,? "
    // var sql = 'select * from user'
    conn.query(sql, params, function(err, result) {
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
//获取用户信息
router.post('/getUserTotal', (req, res) => {
    // console.log(req);
    // const page_num = req.body.pageNumber //当前的num
    // const page_size = req.body.pageSize  //当前页的数量
    // const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    // var sql = "select * from user limit ?,?"
    var sql = 'select * from user '
    const isNoSelect = []
    conn.query(sql, function(err, result) {
        // console.log('====>', result);
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


//更新用户信息
router.put('/updateUser', (req, res) => {
    let params = req.body;
    let sql_update = 'update user set  username=? , sex=?, password=? , phone=? , email=? , status=?, user_pic =? where id=?'
    let update_value = [params.username, params.sex, params.password, params.phone, params.email, params.status,params.user_pic, params.id]
    console.log('params======》',params);
    conn.query(sql_update, update_value, function(err, result) {
        console.log('更新===>',result);
        if (err) {
            console.log(err);
        }
        if (!err && result.length > 0) {
            res.send('更新失败') 
        } else {
            res.send('更新成功'); 
        }
    })
});

// 用户姓名总数查找接口
router.post('/findUserNameTotal', (req, res) => {
    console.log( 'req', req.body);
    const sql = 'select username from user where username = ?'
    const name = req.body.queryString
    const noFind = []
    conn.query(sql, name, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result[0] === undefined) {
                res.send(noFind)   //查询不出username，data 返回-1
            } else {
                jsonWrite(res, result);
            }
        }
    })
})

// 分页查找用户姓名
router.post('/findUserNamePage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const a_name = req.body.queryString
    const params = [ a_name, (parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * from user  where username = ? order by username,createTime desc limit ?,? "
    const isNoSelect = []
    conn.query(sql,params,(err, result) =>{
        console.log('====>', result);
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
}
)

//更改密码
router.post('/modifyPassword', (req, res) => {
    var sql_modify = $sql.user.update_user;
    var params = req.body;
    console.log(params);
    if (params.id) {
        sql_modify +=  " password = '" + params.pass +
                        "',repeatPass = '" + params.checkPass +
                        "' where id ='"+ params.id + "'";
    }
    conn.query(sql_modify, params.id, function(err, result) {
        if (err) {
            console.log(err);
        }
        // console.log(result);
        if (result.affectedRows === undefined) {
            res.send('修改密码失败，请联系管理员')   //查询不出username，data 返回-1
        } else {
            res.send('ok'); 
        }
    })
});


module.exports = router;
