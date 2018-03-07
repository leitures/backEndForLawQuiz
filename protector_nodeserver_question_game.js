var exec = require('child_process').exec;
var schedule = require("node-schedule");
var http = require('http');

const cmdStr = 'node nodeserver_question_game.js &';
const monitorUrl = 'http://127.0.0.1:8835/test';

var rule = new schedule.RecurrenceRule();
var times = [];
for (var i = 1; i < 60; i++) {

    times.push(i);

}

rule.second = times;

var j = schedule.scheduleJob(rule, function() {
    var yeereq = http.request(monitorUrl, function(yeeres) {
        console.log('working fine');
    });
    yeereq.on('error', function(e) {
        console.log('problem with request: ');
        exec(cmdStr, function(err, stdout, stderr) {
            if (err) {
                console.log('restart error!!! danger!');
            } else {
                console.log('restart ok!');
            }
        });

    });

    yeereq.end();

});
