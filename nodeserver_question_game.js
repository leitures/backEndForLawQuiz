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
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/test', function(req, res) {
  res.send(200, 'connected!');
})

app.get('/all_questions', function(req, res) {
  var con = mysql.createConnection(mysqlConnect);

  con.connect(function(err) {
    if (err)
      throw err;
  });

  example6 = "SELECT * FROM " + databaseName + ".game_question"

  con.query(example6, function(error, results, fields) {
    if (error) {
      var opt = JSON.stringify({
        data: '',
        success: false
      });
      res.json(JSON.parse(opt));
      throw error;
    } else {
      console.log('The result is: ', results);
      console.log(typeof(results));
      var opt = JSON.stringify({
        data: results,
        success: true
      });
      res.json(JSON.parse(opt));
    }

  });

  con.end();

});

app.get('/get_questioninfo', function(req, res) {

  var promise = getTotal();
  promise.then(function(value) {
    var current_page = 1; //默认为1
    var num = req.query.page_size; //一页条数
    if (req.query.page) {
          current_page = parseInt(req.query.page);
      }
    var last_page = current_page - 1;
    if (current_page <= 1) {
          last_page = 1;
      }
    var next_page = current_page + 1;

    var con = mysql.createConnection(mysqlConnect);

    con.connect(function(err) {
      if (err)
        throw err;
    });

    example6 = "SELECT * FROM " + databaseName + ".game_question limit " + num + " offset " + num*(current_page -1);


    con.query(example6, function(error, results, fields) {
      if (error) {
        var opt = JSON.stringify({
          data: '',
          success: false
        });
        res.json(JSON.parse(opt));
        throw error;
      } else {


        var opt = JSON.stringify({
          data: results,
          total: value,
          success: true
        });
        res.json(JSON.parse(opt));
      }

    });

    con.end();
  });



});

app.get('/count_questions', function(req, res) {
  var con = mysql.createConnection(mysqlConnect);
  con.connect(function(err) {
    if (err)
      throw err;
  });

  example6 = "SELECT count(id) FROM " + databaseName + ".game_question"

  con.query(example6, function(error, results, fields) {
    if (error) {
      var opt = JSON.stringify({
        data: '',
        success: false
      });
      res.json(JSON.parse(opt));
      throw error;
    } else {
      console.log('The result is: ', results[0]);
      var opt = JSON.stringify({
        data: results,
        success: true
      });
      res.json(JSON.parse(opt));
    }

  });
  con.end();
});

app.post('/save_question', function(req, res) {
  var question = req.body.question;
  var answer_a = req.body.answer_a;
  var answer_b = req.body.answer_b;
  var answer_c = req.body.answer_c;
  var answer_d = req.body.answer_d;
  var correct_answer = req.body.correct_answer;
  var link = req.body.link;

  console.log('question is', question);
  console.log('correct_answer is', correct_answer);
  var con = mysql.createConnection(mysqlConnect);
  con.connect(function(err) {
    if (err)
      throw err;
  });
  add_user = "insert into imonitor.game_question(question,answer_a,answer_b,answer_c,answer_d,correct_answer,link) values('" + question + "','" + answer_a + "','" + answer_b + "','" + answer_c + "','" + answer_d + "','" + correct_answer + "','" + link + "')";

  con.query(add_user, function(error, results, fields) {
    if (error) {
      var opt = JSON.stringify({
        data: '',
        success: false
      });
      res.json(JSON.parse(opt));
      throw error;
    } else {
      console.log('The result is: ', results);
      console.log(typeof(results));
      var opt = JSON.stringify({
        data: results,
        success: true
      });
      res.json(JSON.parse(opt));
    }
  });
  con.end();

});

function getQuestionInfo(id) {
  var promise = new Promise(function(resolve) {
    var question_info;
    var con = mysql.createConnection(mysqlConnect);
    con.connect(function(err) {
      if (err)
        throw err;
    });

    example1 = "SELECT * FROM " + databaseName + ".game_question where id =" + id;

    con.query(example1, function(error, results, fields) {
      if (error) {
        throw error;
        question_info = 'error';
        resolve(question_info);
      } else {
        question_info = results[0];
        resolve(question_info);
      }

    });
    con.end();
  });
  promise.then(function(value) {
    return value
  });
  return promise;
}

function getTotal() {
  var promise = new Promise(function(resolve) {
    var question_info;
    var con = mysql.createConnection(mysqlConnect);
    con.connect(function(err) {
      if (err)
        throw err;
    });

    example1 = "SELECT count(id) FROM " + databaseName + ".game_question";

    con.query(example1, function(error, results, fields) {
      if (error) {
        throw error;
        question_info = 'error';
        resolve(question_info);
      } else {
        question_info = results[0];
        resolve(question_info);
      }

    });
    con.end();
  });
  promise.then(function(value) {
    return value
  });
  return promise;
}


app.get('/get_question', function(req, res) {
  var id = req.query.id;
  var promise = getQuestionInfo(id);
  promise.then(function(value) {
    var opt = JSON.stringify({
      data: {
        questionInfo: value
      },
      success: true
    });
    res.json(JSON.parse(opt));
  });

});

app.get('/get_list', function(req, res) {
  var totalNum = 19;
  var randomSet = [];
  for (var i = 0; i < 10; i++) {
    pushNum();
  }

  function pushNum() {
    var num = Math.floor(Math.random() * totalNum);
    if (randomSet.indexOf(num) < 0 && num > 0) {
      randomSet.push(num)
    } else {
      pushNum()
    }
  }
  console.log(randomSet);
  var opt = JSON.stringify({
    data: {
      quizNumSet: randomSet
    },
    success: true
  });
  res.json(JSON.parse(opt));

});

app.post('/commit_question', function(req, res) {
  var id = req.body.id;
  var flag = req.body.flag;
  console.log('id',id);

  console.log('flag',flag);

  var con = mysql.createConnection(mysqlConnect);
  con.connect(function(err) {
    if (err)
      throw err;
  });

  commit_sql_flag0 = "update imonitor.game_question set wrong_num=wrong_num+1 where id = '" + id+"'";
  commit_sql_flag1 = "update imonitor.game_question set correct_num=correct_num+1 where id = '" + id+"'";

  if(flag == 0){
    con.query(commit_sql_flag0, function(error, results, fields) {
      if (error) {
        var opt = JSON.stringify({
          data: '',
          success: false
        });
        res.json(JSON.parse(opt));
        throw error;
      } else {
        console.log('The result is: ', results);
        var opt = JSON.stringify({
          success: true
        });
        res.json(JSON.parse(opt));
      }

    });
  }else{
    con.query(commit_sql_flag1, function(error, results, fields) {
      if (error) {
        var opt = JSON.stringify({
          data: '',
          success: false
        });
        res.json(JSON.parse(opt));
        throw error;
      } else {
        console.log('The result is: ', results);
        var opt = JSON.stringify({
          success: true
        });
        res.json(JSON.parse(opt));
      }

    });
  }

  con.end();

});

app.post('/save_user', function(req, res) {
  var username = req.body.username;
  var phone = req.body.phone;
  var score = req.body.score;

  var con = mysql.createConnection(mysqlConnect);
  con.connect(function(err) {
    if (err)
      throw err;
  });
  add_user = "insert into imonitor.game_user(username,phone,score) values('" + username + "','" + phone + "','" + score +  "')";

  con.query(add_user, function(error, results, fields) {
    if (error) {
      var opt = JSON.stringify({
        data: '',
        success: false
      });
      res.json(JSON.parse(opt));
      throw error;
    } else {
      console.log('The result is: ', results);
      console.log(typeof(results));
      var opt = JSON.stringify({
        data: results,
        success: true
      });
      res.json(JSON.parse(opt));
    }
  });
  con.end();

});




app.listen(8835, function() {
  console.log('CORS-enabled web server listening on port 8835')
})
