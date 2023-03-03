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


// 查找申请社区表单
router.post('/findApplicationInfon', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const a_name = req.body.queryString
    const params = [a_name, (parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * FROM application LEFT JOIN user on application.u_id = user.id LEFT JOIN home ON application.h_id = home.h_id LEFT JOIN admin ON application.app_id = admin.id order by application.app_id asc  limit ?,? "
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

// 添加申请社区表单
router.post('/inserApplicationInfon',(req, res) => {
    const params = req.body
    const cTime = new Date()
    let sql = 'insert into application set u_id=?, h_id= ?, opinion=?, number=?, address=?,  app_createTime= ?'
    var add_value = [ params.u_id, params.h_id, params.opinion, params.number, params.address, cTime ]
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

// 修改申请信息
router.put('/updateApplicationInfon',(req, res) => {  
    const params = req.body
    const cTime = new Date()
    console.log(params);
    let sql_update = 'update application set h_id= ?, opinion= ?, number= ?, address=?, a_id= ?, app_status=?, app_isDelete = ?,agreeTime=? where app_id =?'
    let update_value = [params.h_id, params.opinion, params.number ,params.address, params.a_id ,params.app_status, params.app_isDelete,  cTime, params.app_id ]
    conn.query(sql_update,update_value, function(err, result) {
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
});



// 查找全部申请
router.post('/findApplicationIsAll', (req, res) => {
    let sql = "select app_id FROM application"
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
});

// 查找申请通过的
router.post('/findApplicationIsOk', (req, res) => {
    let sql = "select app_id FROM application where app_status = 1 "
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
});

// 查找未申请通过的
router.post('/findApplicationIsNoOk', (req, res) => {
    let sql = "select app_id FROM application where app_status = 2 "
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
});

// 查找未审核的
router.post('/findApplicationIsWait', (req, res) => {
    let sql = "select app_id FROM application where app_status = 0 "
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
});

// 查找未审核的
router.post('/findApplicationIsWait', (req, res) => {
    let sql = "select app_id FROM application where app_status = 0"
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
});

// 分页查找未审核的的表单
router.post('/findApplicationIsWaitPage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * FROM application LEFT JOIN user on application.u_id = user.id LEFT JOIN home ON application.h_id = home.h_id  where application.app_status = 0 order by application.app_id asc  limit ?,? "
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

// 按编号查找接口
router.post('/findAppIdTotal', (req, res) => {
    let sql = 'select app_id from application where app_id = ? and app_status = 0 ' 
     const app_id = req.body.queryString
    const isNoSelect = []
    const params = [app_id]
    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result[0] === undefined) {
                res.send(isNoSelect)   //查询不出username，data 返回-1
            } else {
                jsonWrite(res, result);
            }
        }
    })
})

// 分页按编号查找未审核的
router.post('/findAppIdPage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const app_id = req.body.queryString
    const params = [ app_id, (parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * FROM application LEFT JOIN user on application.u_id = user.id LEFT JOIN home ON application.h_id = home.h_id  where application.app_status = 0  and app_id =?  order by application.app_id asc  limit ?,? "
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

/**
 * 查找全部的申请记录
 */

// 分页查找未审核的的表单
router.post('/findApplicationIsAlltPage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * FROM application LEFT JOIN user on application.u_id = user.id LEFT JOIN home ON application.h_id = home.h_id LEFT JOIN admin ON application.a_id = admin.id  order by application.app_id asc  limit ?,? "
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

// 按编号查找接口
router.post('/findAppIdIsAllTotal', (req, res) => {
    let sql = 'select app_id from application where app_id = ?' 
     const app_id = req.body.queryString
    const isNoSelect = []
    const params = [app_id]
    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result[0] === undefined) {
                res.send(isNoSelect)   //查询不出username，data 返回-1
            } else {
                jsonWrite(res, result);
            }
        }
    })
})

// 分页按编号查找未审核的
router.post('/findAppIdIsAllPage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const app_id = req.body.queryString
    const params = [app_id, (parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * FROM application LEFT JOIN user on application.u_id = user.id LEFT JOIN home ON application.h_id = home.h_id LEFT JOIN admin ON application.a_id = admin.id  where app_id =?   order by application.app_id asc  limit ?,? "
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

/**
 * 查找申请通过的记录
 */

// 分页查找申请通过的记录
router.post('/findApplicationIsOkPage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * FROM application LEFT JOIN user on application.u_id = user.id LEFT JOIN home ON application.h_id = home.h_id LEFT JOIN admin ON application.a_id = admin.id  where application.app_status = 1 order by application.app_id asc  limit ?,? "
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

// 按编号查找接口
router.post('/findAppIdIsOkTotal', (req, res) => {
    let sql = 'select app_id from application where app_id = ? and app_status = 1' 
    const app_id = req.body.queryString
    const isNoSelect = []
    const params = [app_id]
    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result[0] === undefined) {
                res.send(isNoSelect)   //查询不出username，data 返回-1
            } else {
                jsonWrite(res, result);
            }
        }
    })
})

// 分页按编号查找未审核的
router.post('/findAppIdIsOkPage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const app_id = req.body.queryString
    const params = [ app_id, (parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * FROM application LEFT JOIN user on application.u_id = user.id LEFT JOIN home ON application.h_id = home.h_id LEFT JOIN admin ON application.a_id = admin.id  where  app_id =?  and application.app_status = 1 order by application.app_id asc  limit ?,? "
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

// 分页按编号查找未审核的
router.post('/findAppIdIsOkPage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const app_id = req.body.queryString
    const params = [app_id, (parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * FROM application LEFT JOIN user on application.u_id = user.id LEFT JOIN home ON application.h_id = home.h_id LEFT JOIN admin ON application.a_id = admin.id  where app_id =?  and application.app_status = 1 order by application.app_id asc  limit ?,? "
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

/**
 * 查找拒绝的记录
 */

// 分页查找拒绝的记录
router.post('/findApplicationIsNoOkPage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * FROM application LEFT JOIN user on application.u_id = user.id LEFT JOIN home ON application.h_id = home.h_id LEFT JOIN admin ON application.a_id = admin.id  where application.app_status = 2 order by application.app_id asc  limit ?,? "
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

// 按编号查找接口
router.post('/findAppIdIsNoOkTotal', (req, res) => {
    console.log( 'req', req.body);

    let sql = 'select app_id from application where app_id = ? and app_status = 2' 
    const app_id = req.body.queryString
    const isNoSelect = []
    const params = [app_id, u_id]
    conn.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result[0] === undefined) {
                res.send(isNoSelect)   //查询不出username，data 返回-1
            } else {
                jsonWrite(res, result);
            }
        }
    })
})

// 分页按编号查找未审核的
router.post('/findAppIdIsNoOkPage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const app_id = req.body.queryString
    const params = [app_id, (parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * FROM application LEFT JOIN user on application.u_id = user.id LEFT JOIN home ON application.h_id = home.h_id LEFT JOIN admin ON application.a_id = admin.id  where app_id =? and application.app_status = 2 order by application.app_id asc  limit ?,? "
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

// 分页按编号查找未审核的
router.post('/findAppIdIsNoOkPage', (req, res) => {
    const page_num = req.body.pageNumber //当前的页数 通常 -1 
    const page_size = req.body.pageSize  //当前页的数量
    const app_id = req.body.queryString
    const params = [app_id, (parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    let sql = "select * FROM application LEFT JOIN user on application.u_id = user.id LEFT JOIN home ON application.h_id = home.h_id LEFT JOIN admin ON application.a_id = admin.id  where app_id =?  and application.app_status = 2 order by application.app_id asc  limit ?,? "
    const isNoSelect = []
    conn.query(sql,params,(err, result) =>{
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

module.exports = router;