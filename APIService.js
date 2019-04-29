var express = require('express');
const bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var db;

MongoClient.connect("mongodb+srv://quantum:Quantumdata123@cluster0-jjukt.mongodb.net/test?retryWrites=true", function(err, database) {
  if(err) throw err;

  db = database.db('iot');

  app.listen(3000);
  console.log("Listening on port 3000");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/:deviceid", function(req, res) {
  db.collection(req.params.deviceid).insertOne(req.body).then (function() {
    res.send("OK!");
    res.end();
  });
});

app.get("/:deviceid", function(req, res) {
  var group = [];
  db.collection(req.params.deviceid).find({}).toArray(function(err, docs){
    res.send(docs);
    res.end();
  });
});

app.get("/:deviceid/last/:amount", function(req, res) {
  var limitAmount = parseInt(req.params.amount);
  db.collection(req.params.deviceid).find({}).sort( { _id : -1 } ).limit(limitAmount).toArray(function(err, docs){
    res.send(docs);
    res.end();
  });
});