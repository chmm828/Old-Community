var models = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');

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

// 按管理员名字查找接口
router.post('/findAdminNameTotal', (req, res) => {
    console.log( 'req', req.body);
    const sql = 'select a_name from admin where a_name = ?'
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

// 分页查找管理员姓名
router.post('/findAdminNamePage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const a_name = req.body.queryString
    const params = [ a_name, (parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * from admin  where a_name = ? order by a_name,createTime desc limit ?,? "
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

// 管理员登陆接口
router.post('/getAdminLogin', (req, res) => {
    const sql = 'select * from admin  where a_account= ? and password= ? '
    var where_value = [req.body.name, req.body.password];
    console.log(req);
    conn.query(sql, where_value, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            res.send('-1')   //查询不出username，data 返回-1
        } else {
            var resultArray = result[0];
            console.log(resultArray);
            // console.log(keywords);
            if (resultArray.password === req.body.password) {
                jsonWrite(res, result);
            } else {
                res.send('0')   //username
            }
        }
    })
});


// 获取管理员表格信息
router.post('/getAdmin', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const isNoSelect = []
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    var sql = "select * from admin order by a_name desc limit ?,? "
    conn.query(sql, params, function (err, result) {
        // console.log('====>', result[0]);
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
// 获取管理员信息
router.get('/getAdminTotal', (req, res) => {
    var sql = 'select * from admin'
    const isNoSelect = []
    conn.query(sql, function (err, result) {
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

// 注册查重
router.post('/findAdminAccountRepeat', (req,res) => {
    let sql = 'select a_account FROM admin where a_account = ?'
    let params = req.body;
    conn.query(sql,params.a_account, function(err, result){
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
// 新增管理员
router.post('/addAdminInfon',(req, res) => {
    const params = req.body
    const cTime = new Date()
    let sql = 'insert into admin set a_account=? , admin_pic=? , password=?, a_name = ?, phone=?, createTime = ?,role = ?'
    var add_value = [ params.a_account, params.admin_pic, params.password, params.a_name, params.phone, cTime, params.role]
    conn.query(sql,add_value, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            console.log(result);
            res.send('注册成功') 
        }
    })
})

//编就管理员信息
router.put('/updateAdmin', (req, res) => {
    let params = req.body;
    let sql_update = 'update admin  set a_account=? , admin_pic=? , password=?, a_name = ?, phone=?, role = ? where id=?'
    let update_value = [ params.a_account, params.admin_pic, params.password, params.a_name, params.phone, params.role, params.id]
    conn.query(sql_update, update_value, function(err, result) {
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

module.exports = router;
