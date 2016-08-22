// Retrieve
var MongoClient = require('mongodb').MongoClient;
var bodyParser  = require('body-parser');
var express 	= require('express');
var mongoose    = require("mongoose");
var router      = express.Router();
var mongoOp     = require("./model/mongo");

var app         =   express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World"});
});

//  Users

router.route("/users")
    .get(function(req,res){
        var response = {};
        mongoOp.find({},function(err,data){
        // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
   .post(function(req,res){
        var db = new mongoOp();
        var response = {};
       
        db.userEmail = req.body.email;         
        db.userPassword =  require('crypto')
                          .createHash('sha1')
                          .update(req.body.password)
                          .digest('base64');
        db.save(function(err){
            if(err) {
                response = {"error" : true,"message" : "Error adding data"};
            } else {
                response = {"error" : false,"message" : "Data added"};
            }
            res.json(response);
        });
    });

router.route("/users/:id")
    .get(function(req,res){
        var response = {};
        mongoOp.findById(req.params.id,function(err,data){
        // This will run Mongo Query to fetch data based on ID.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        });
    })
    .put(function(req,res){
        var response = {};
        // first find out record exists or not
        // if it does then update the record
        mongoOp.findById(req.params.id,function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
            // we got data from Mongo.
            // change it accordingly.
                if(req.body.userEmail !== undefined) {
                    // case where email needs to be updated.
                    data.userEmail = req.body.userEmail;
                }
                if(req.body.userPassword !== undefined) {
                    // case where password needs to be updated
                    data.userPassword = req.body.userPassword;
                }
                // save the data
                data.save(function(err){
                    if(err) {
                        response = {"error" : true,"message" : "Error updating data"};
                    } else {
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        });
    })
    .delete(function(req,res){
            var response = {};
            // find the data
            mongoOp.findById(req.params.id,function(err,data){
                if(err) {
                    response = {"error" : true,"message" : "Error fetching data"};
                } else {
                    // data exists, remove it.
                    mongoOp.remove({_id : req.params.id},function(err){
                        if(err) {
                            response = {"error" : true,"message" : "Error deleting data"};
                        } else {
                            response = {"error" : true,"message" : "Data associated with "+req.params.id+"is deleted"};
                        }
                        res.json(response);
                    });
                }
            });
    })



//app.listen(3000);
var server = app.listen(8080, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log('Example app listening at http://%s:%s', host, port);
 });
console.log("Listening to PORT 3000");

app.use('/',router);

app.use('/bower_components', express.static(__dirname + '/client/bower_components'));
app.use('/app', express.static(__dirname + '/client/bower_components/app'));

app.route('/index.html')
    .get((req, res) => {
      //res.sendFile(path.resolve(app.get('appPath') + '/client/index.html'));
      res.sendFile(__dirname  + '/client/index.html');
    });

