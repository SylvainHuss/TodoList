/** Appel des dépendances et des packages externes */
var Liste = require('./model').Liste;
var Categorie = require('./model').Categorie;
var dataLayer = require('./dataLayer');
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID;
var session = require('express-session');
var sha1 = require('js-sha1');

/* Initialisation : */
var app = express();

app.use(express.static(__dirname + '/public')); //Dossier des données statics
app.use(morgan('dev')); //color output for development usage
app.use(bodyParser.urlencoded({'extended':'true'})); 
app.use(bodyParser.json());
app.use(bodyParser.json({ type : 'application/vnd.api+json' })); //type de l'application

function ignoreFavicon(req, res, next) {
    if (req.originalUrl === '/favicon.ico') {
      res.status(204).json({nope: true});
    } else {
      next();
    }
  }

  app.use(ignoreFavicon);

dataLayer.init(function(){
    console.log("init");
    app.listen(8080);
    console.log("on utilise le port 8080");
});

app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'keyboard cat'
}));

app.get('/api/laliste', function(req, res){
    if (typeof req.session.username != "undefined"){
        dataLayer.getTaskSet(req.session.username, function(data){
            res.send(data);
        });
    }
    else {
        res.send("401");
    }
});

app.get('/api/user', function(req, res){
    res.send(req.session.username);
});

app.get('/taches', function(req, res){
    res.sendFile(__dirname + '/public/taches.html');
});

app.get('/accueil', function(req, res){
    req.session.destroy();
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/category', function(req, res){
    dataLayer.getCategorySet(req.session.username, function(data){
        res.send(data);
    });
});

app.post('/api/laliste/:category/:newtask', function(req, res){
    if (req.params && typeof req.params.newtask != "undefined"){

        var task = {
            text : req.params.newtask,
            done : false,
            date : new Date().toLocaleTimeString('en-GB', {formatMatcher: 'basic'}),
            creator : req.session.username,
            category: req.params.category
        };
        dataLayer.insertTask(task, function(){
            dataLayer.getTaskSet(req.session.username, function(data){
                res.send(data);
            });
        });
    };
});

app.post('/api/category/:category', function(req, res){
    if (req.params && typeof req.params.category != "undefined"){

        var newcategory = {
            text : req.params.category,
            creator : req.session.username
        };
        dataLayer.insertCategory(newcategory, function(){
            dataLayer.getCategorySet(req.session.username, function(data){
                res.send(data);
            });
        });
    };
});

app.post('/api/user/', function(req, res){
    if (req.body){
        dataLayer.getPassword(req.body.username, function(data){
            console.log(data[0]);
            console.log(req.body);
            if (typeof data[0]!="undefined" && data[0].password == sha1(req.body.password)){
                var user = {
                    username : req.body.username,
                    password : sha1(req.body.password)
                };
                req.session.username = req.body.username;
                res.send(user);
            }
        });
    };
});

app.post('/api/createuser/', function(req, res){
    if (req.body && req.body.username != "" && req.body.password != ""){
        var user = {
            username : req.body.username,
            password : sha1(req.body.password)
        }; 
        console.log(user);
        dataLayer.getPassword(req.body.username, function(data){
            console.log(typeof data[0]);
            if (typeof data[0]=="undefined"){
                dataLayer.createUser(user, function(){
                    res.send(user);
                });
            }
        });
    };
});

app.delete('/api/laliste/:liste_id', function(req, res){
    var id = new ObjectId(req.params.liste_id);
    dataLayer.removeTask(id, function(){
        dataLayer.getTaskSet(req.session.username, function(data){
            res.send(data);
        });
    });
});

app.delete('/api/category/:category_id', function(req, res){
    var id = new ObjectId(req.params.category_id);
    dataLayer.removeCategory(id, function(){
        dataLayer.getCategorySet(req.session.username, function(data){
            res.send(data);
        });
    });
});

app.put('/api/laliste/:liste_id', function(req, res){
    var id = new ObjectId(req.params.liste_id);
    
    dataLayer.checkTask(id, function(){
        dataLayer.getTaskSet(req.session.username, function(data){
            res.send(data);
        });
    });
});

app.put('/api/laliste/todo/:liste_id/:newtext', function(req, res){
    var id = new ObjectId(req.params.liste_id);
    dataLayer.changeName(id, req.params.newtext, function(){
        dataLayer.getTaskSet(req.session.username, function(data){
            res.send(data);
        });
    });
});