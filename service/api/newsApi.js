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

// 查询新闻
router.get('/findNews', (req, res) => {
    const sql ='select * from news inner join admin on news.a_id = admin.id'
    const isNoSelect = []
    conn.query(sql, (err, result) => {
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

// 查询新闻
router.get('/findNewsToHome', (req, res) => {
    const sql ='select * from news where news.m_status = 1'
    const isNoSelect = []
    conn.query(sql, (err, result) => {
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

// 添加新闻
router.post('/inserNews',(req, res) => {
    const params = req.body
    const cTime = new Date()
    let sql = 'insert into news set m_msg=?, mCreateTime= ?, m_status= ?, a_id=?'
    var add_value = [ params.m_msg, cTime, params.m_status, params.a_id]
    conn.query(sql,add_value, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            res.json({
                code: 200,
                msg: "添加成功",
            });
        }else {
            res.json({
                code: 400,
                msg: "添加失败"
            })
        }
    })
});

// 修改新闻
router.put('/updateNews', (req, res) => {
    const params = [req.body.m_msg, req.body.m_status, req.body.m_id, req.body.a_id]
    const sql_update = 'update news set m_msg =?, m_status=?  where m_id= ? and a_id =? '
    conn.query(sql_update,params, function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            res.json({
                code: 200,
                msg: "修改成功",
            });
        }
    })
})

// 删除新闻
router.post('/deleteNews', function (req, res) {
    var params = req.body
    var sql = 'DELETE FROM news WHERE m_id = ?'
    var where_value = [params.m_id];
    // console.log(sql)
    conn.query(sql, where_value, function (err, result) {
        if (err) {
            console.log('删除失败', err.message);
        }
        if (result) {
            res.json({
                code: 200,
                msg: "删除成功",
            });
        }
    });
})

module.exports = router;