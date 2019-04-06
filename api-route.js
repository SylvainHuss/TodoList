/** Appel des dépendances et des packages externes */
var Liste = require('./model').Liste;

var list = function(req, res) {
    res.sendFile('./public/index.html');
};

var list2 = function(req, res) {
    Liste.find(function(err, laliste) {
        if (err)
            res.send(err)
        res.json(laliste);
    })
};

var add = function(req, res) {
    Liste.create({
        text : req.body.text,
        done : false,
        date: new Date().toLocaleTimeString('en-GB', {formatMatcher: 'basic'}),
        creator: "Sylvain"
    }, function(err, liste) {
        if (err)
            res.send(err);
        Liste.find(function(err, laliste) {
            if (err)
                res.send(err)
            res.json(laliste);
        });
    });
};

var remove = function(req, res) {
    Liste.deleteOne({
        _id : req.params.liste_id
    }, function(err, liste) {
        if (err)
            res.send(err);
        Liste.find(function(err, laliste) {
            if (err)
                res.send(err)
            res.json(laliste);
        }); 
    });
};

var check = function(req, res) {
    Liste.findById(req.params.liste_id, function(err, laliste) {
        if (err)
            res.send(err);
        var olddone = laliste.done;
        Liste.findByIdAndUpdate(req.params.liste_id,{done: !olddone} , 
        function(err, liste) {
            if (err)
                res.send(err);
            Liste.find(function(err, laliste) {
                if (err)
                    res.send(err)
                res.json(laliste);
            }); 
        });
    });
};

module.exports = {list, list2, add, remove, check};