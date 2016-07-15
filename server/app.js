var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'username',
    password : 'password',
    database : 'todo'
});
app.get('/', function (req, res) {
    res.send('Hello World!');
});

//get all todoItems
app.get('/todoList', function(req, res) {
    connection.query('SELECT * FROM todoList', function(err, rows, fields ){
        if(err) {
            console.log(err);
        }
        res.send(rows);
    });
});


//add todoItem
app.post('/todoList', function(req, res) {
    var todoItem = req.body;

    // res.send(todoItem);
    var todoItemAddSql = "INSERT INTO todoList VALUES(?,?,?,?)";
    var todoItemAddSql_Params=[todoItem.id, todoItem.created,todoItem.isComplete,todoItem.label];

    connection.query(todoItemAddSql, todoItemAddSql_Params, function(err, result) {

      if(err){
        res.send(err);
      }
        res.send(result);
    });

});

//update todoItem
app.put('/todoList',function(req,res){
  var todoItem = req.body;

  var todoItemAddSql = "UPDATE todoList SET isComplete = ? , label = ? where id = ?";
  var todoItemAddSql_Params=[todoItem.isComplete ,todoItem.label,todoItem.id];

  connection.query(todoItemAddSql,todoItemAddSql_Params,function(err,result){
    if(err){
      res.send(err);
    }
    res.send(result);
  });
});

//query todoItem
app.get("/todoList/:id",function(req,res){
  var id = req.param("id");
  connection.query("SELECT * FROM todoList WHERE id = "+id,function(err , result){
    res.send(result);
  });
});

//delete todoItem
app.delete('/todoList/:id', function(req, res){
    // var key = req.body.key;
    var id = req.param('id');
    connection.query('DELETE FROM todoList WHERE id = '+id, function(err, result){
        res.send(result);
    });
});

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)
});
