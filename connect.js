var express=require("express");
var app=express();


var middleware=require("./middleware");
var server=require("./server");
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;

const url='mongodb://127.0.0.1:27017';
const dbName='hospitalInventory';
let db;
MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName)
    console.log(`Connected to database:${url}`);
    console.log(`Database : ${dbName}`);
});
app.get('/hospitaldetails',middleware.checkToken,function(req,res){
    console.log("Fetching details form hospital collection");
    db.collection('hospital').find().toArray(function(err,result){
        if(err) console.log(err);
        res.json(result);
    })
});

app.get('/ventilatordetails',middleware.checkToken,function(req,res){
    console.log("Fetching details form ventilator collection");
    db.collection('ventilators').find().toArray(function(err,result){
        if(err) console.log(err);
        res.json(result);
    })
});

app.post('/searchventilators',middleware.checkToken,function(req,res){
    console.log("search ventilator by status")
    var hid=req.query.hid;
    var status=req.query.status;
    var query={"hid":hid,"status":status};
    //var query={"status":status};
    console.log(hid +" " + status);
    db.collection('ventilators').find(query).toArray().then(result=> res.json(result));
});

app.post('/searchospitals',middleware.checkToken,function(req,res){
    console.log("search hospital by name");
    var name=req.query.name;
    var query={"name":name};
    console.log(name);
    db.collection('hospital').find(query).toArray().then(result => res.json(result));
});

app.put('/updateventilatorsdetails',middleware.checkToken,function(req,res){
    console.log("Update ventilator details");
    var vid=req.query.vid;
    var status=req.query.status;
    console.log(vid+" "+status);
    var query1={"vid":vid};
    var query2={$set:{"status":status}};
    db.collection('ventilators').updateOne(query1,query2,function(err,result){
        if(err) console.log("update Unsuccessful");
        res.json("1 document updated");
        //res.json(result);
    });
});

app.post('/addventilators',middleware.checkToken,function(req,res){
    console.log("Adding a ventilator to the ventilatorInfo");
    var hid=req.query.hid;
    var vid=req.query.vid;
    var status=req.query.status;
    var name=req.query.name;
    console.log(hid+" "+vid+" "+status+" "+name);
    var query={"hid":hid,"vid":vid,"status":status,"name":name};
    db.collection('ventilators').insertOne(query,function(err,result){
        if(err) console.log("record not inserted");
        res.json("ventilator added");
        //res.json(result);
    });
});

app.delete('/deleteventilators',middleware.checkToken,function(req,res){
    console.log("deleting a ventilator by Vid");
    var vid=req.query.vid;
    console.log(vid);
    var q1={"vid":vid};
    db.collection('ventilators').deleteOne(q1,function(err,result){
        if(err) console.log("error in deleting the document");
        res.json("ventilator deleted");
    });
});
app.listen(1000);