var MongoOplog = require('mongo-oplog');
var express=require("express");
var app=express();
var server = require("http").createServer(app);
var io=require("socket.io").listen(server);


app.get('/lights', function(req, res){
  res.sendfile('lights.html');
});

app.get('/smoothie.js', function(req, res){
  res.sendfile('node_modules/smoothie/smoothie.js');
});

server.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

var MongoHQURL="mongodb://user:password@host:port,host:port/local?authSource=database"

var oplog = MongoOplog(MongoHQURL, 'database.collection').tail();

var stamps=[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var inserts=[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
var updates=[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
var deletes=[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

var insertCount=0;
var updateCount=0;
var deleteCount=0;

oplog.on('insert', function (doc) {
  insertCount=insertCount+1;
});

oplog.on('update', function (doc) {
  updateCount=updateCount+1;
});

oplog.on('delete', function (doc) {
  deleteCount=deleteCount+1;
});


io.sockets.on('connection', function(socket) {
  for(i=0;i<stamps.length;i++) {
      socket.emit("iud", { t:stamps[i], i:inserts[i], u:updates[i], d:deletes[i] });
  }
});

function sampler() {
    console.log("i:"+insertCount+" u:"+updateCount+" d:"+deleteCount);
    var now=new Date().getTime();
    io.sockets.emit("iud", { t:now, i:insertCount, u:updateCount, d:deleteCount });
    stamps.push(now);
    inserts.push(insertCount);
    updates.push(updateCount);
    deletes.push(deleteCount);
    stamps.shift();
    inserts.shift();
    updates.shift();
    deletes.shift();
    insertCount=0;
    updateCount=0;
    deleteCount=0;


    setTimeout(sampler,1000);
}



sampler();
