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

// 正常分页查询社区所有信息
router.post('/findHomeInfo', (req, res) => {
    const isNoSelect = []
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    var sql = "select * from home order by h_name desc limit ?,? "
    // var sql = 'select * from user'
    conn.query(sql, params, function (err, result) {
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
})

//获取社区总数
router.post('/getHomeTotal', (req, res) => {
    // console.log(req);
    // const page_num = req.body.pageNumber //当前的num
    // const page_size = req.body.pageSize  //当前页的数量
    // const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    // var sql = "select * from user limit ?,?"
    var sql = 'select  * from home '
    const isNoSelect = []
    conn.query(sql, function (err, result) {
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

// 按社区名字总数查找接口
router.post('/findHomeNameTotal', (req, res) => {
    console.log('req', req.body);
    const sql = 'select h_name from home where h_name = ?'
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


// 查找没有禁用的社区
router.post('/findHomeCatName', (req, res) => {
    const sql = 'select * from home where isDelete  =  0'
    const noFind = []
    conn.query(sql, (err, result) => {
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

// 按分页查询社区名字
router.post('/findHomeNamePage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const a_name = req.body.queryString
    const params = [a_name, (parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * from home  where h_name = ? order by h_name desc limit ?,? "
    const isNoSelect = []
    conn.query(sql, params, (err, result) => {
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
});

// 更新社区信息
router.put('/updateHome', (req, res) => {
    let params = req.body;
    let sql_update = 'update home set  h_name=?, isDelete=? where h_id =?'
    let update_value = [params.h_name, params.isDelete, params.h_id]
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

// 新增社区
router.post('/inserHomeInfon',(req, res) => {
    const params = req.body
    const cTime = new Date()
    let sql = 'insert into home set h_name=? , isDelete=? , createTime= ?'
    var add_value = [ params.h_name, params.isDelete, cTime ]
    conn.query(sql,add_value, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            console.log(result);
            res.send('添加成功') 
        }
    })
})


module.exports = router;