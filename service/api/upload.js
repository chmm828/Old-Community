var models = require('../db/db');
const express = require("express");
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const app = new express();

//图片上传
router.post(
    "/upload",
    multer({
        //设置文件存储路径
        dest: "public/image",
    }).array("file", 1),
    function (req, res, next) {
        let files = req.files;
        let file = files[0];
        let fileInfo = {};
        let path = "public/image/" + Date.now().toString() + "_" + file.originalname;
        fs.renameSync("./public/image/" + file.filename, path);
        //获取文件基本信息
        fileInfo.type = file.mimetype;
        fileInfo.name = file.originalname;
        fileInfo.size = file.size;
        fileInfo.path = path;
        res.json({
            code: 200,
            msg: "OK",
            data: fileInfo,
        });
    }
);

module.exports = router;
