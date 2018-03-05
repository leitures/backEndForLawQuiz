const config = require('./config'); //引入配置文件
var express = require('express');
var cors = require('cors');
var http = require('http');
var qs = require('querystring');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
const databaseName = config.databaseName;
const mysqlConnect = {
    host: config.databaseHost,
    port: config.databasePort,
    user: config.databaseUser,
    password: config.databasePwd
}


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/test', function(req, res) {
    res.send(200, 'connected!');
})

app.post('/save_userinfo', function(req, res) {
    var originId = req.body.originId;
    var currentId = req.body.currentId;
    var pageUrl = req.body.pageUrl;
    console.log('originId is',originId);
    console.log('currentId is',currentId);
    var con = mysql.createConnection(mysqlConnect);
    con.connect(function(err) {
        if (err)
            throw err;
    });
    // add_user = "insert into imonitor.wwy_user(openId,sex,language,city,province,country,headImgUrl,unionId) values('"+openId+"','"+sex+"','"+language+"','"+city+"','"+province+"','"+country+"','"+headImgUrl+"','"+unionId+"')";
    add_user = "insert into "+databaseName+".weibo_user(originId,currentId,pageUrl) values('"+originId+"','"+currentId+"','"+pageUrl+"')";
    con.query(add_user, function(error, results, fields) {
        if (error) {
            var opt = JSON.stringify({data: '', success: false});
            res.json(JSON.parse(opt));
            throw error;
        } else {
            console.log('The result is: ', results);
            console.log(typeof(results));
            var opt = JSON.stringify({data: results, success: true});
            res.json(JSON.parse(opt));
        }

    });

    con.end();

});

app.get('/search_user', function(req, res) {
    var keyword = req.query.keyword;
    var con = mysql.createConnection(mysqlConnect);
    con.connect(function(err) {
        if (err)
            throw err;
    });
    example3 = "SELECT * FROM "+databaseName+".weibo_user WHERE originId like '%" + keyword + "%'";
    con.query(example3, function(error, results, fields) {
        if (error) {
            var opt = JSON.stringify({data: '', success: false});
            res.json(JSON.parse(opt));
            throw error;
        } else {
            console.log('The result is: ', results);
            console.log(typeof(results));
            var opt = JSON.stringify({data: results, success: true});
            res.json(JSON.parse(opt));
        }
    });
    con.end();
});

app.get('/all_users', function(req, res) {
    var con = mysql.createConnection(mysqlConnect);

    con.connect(function(err) {
        if (err)
            throw err;
    });

    example6 = "SELECT * FROM "+databaseName+".weibo_user"

    con.query(example6, function(error, results, fields) {
        if (error) {
            var opt = JSON.stringify({data: '', success: false});
            res.json(JSON.parse(opt));
            throw error;
        } else {
            console.log('The result is: ', results);
            console.log(typeof(results));
            var opt = JSON.stringify({data: results, success: true});
            res.json(JSON.parse(opt));
        }

    });

    con.end();

});


app.listen(8825, function() {
    console.log('CORS-enabled web server listening on port 8825')
})
