var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://sylvain:C1l2o3w4n5%21@cluster0-h4knt.mongodb.net/myfirstdb?retryWrites=true";
var client = new MongoClient(url, {useNewUrlParser :true});
var db;

var dataLayer ={
    init : function(cb){
        //Initialise connection
        client.connect(function(err){
            if (err) throw err;

            db = client.db("myfirstdb");
            cb();
        });
    },

    getTaskSet : function(username, cb){
        db.collection("listes").find({creator: username}).toArray(function(err, docs){
            cb(docs);
        });
    },

    getPassword : function(username, cb){
        db.collection("utilisateur").find({username: username}).toArray(function(err, docs){
            cb(docs);
        });
    },

    createUser : function(user, cb){
        db.collection("utilisateur").insertOne(user, function(err, result){
            cb();
        });
    },

    getCategorySet : function(username, cb){
        db.collection("categories").find({creator: username}).toArray(function(err, docs){
            cb(docs);
        });
    },

    insertTask : function(task, cb){
        db.collection("listes").insertOne(task, function(err, result){
            cb();
        });
    },

    insertCategory : function(task, cb){
        db.collection("categories").insertOne(task, function(err, result){
            cb();
        });
    },

    removeTask : function(id, cb){
        db.collection("listes").deleteOne({_id: id}, function(err, result){
            cb();
        });
    },

    removeCategory : function(id, cb){
        db.collection("categories").deleteOne({_id: id}, function(err, result){
            cb();
        });
    },
    
    checkTask : function(id, cb){
        db.collection("listes").find({_id: id}).toArray(function(err, result){
            var newdone = !(result[0].done);
            db.collection("listes").updateOne({_id: id}, {$set:{done: newdone}}, function(err, result){
                cb();
            });
        });
    },

    changeName : function(id, newname, cb){
        db.collection("listes").updateOne({_id: id}, {$set:{text: newname}}, function(err, result){
            cb();
        });
    }
};

module.exports = dataLayer;