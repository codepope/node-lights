var MongoOplog = require('mongo-oplog');

var MongoHQURL="mongodb://user:password@host:port,host:port/local?authSource=database"

var oplog = MongoOplog(MongoHQURL, 'database.collection').tail();

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

var stamps=[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var inserts=[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
var updates=[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
var deletes=[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

function sampler() {
    console.log("i:"+insertCount+" u:"+updateCount+" d:"+deleteCount);
    var now=new Date().getTime();
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
