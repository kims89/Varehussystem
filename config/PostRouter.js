var app = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var admconfig = require('./adminInfo.js');
var getJSON = require('get-json');
var moment = require('moment');
var urlPrisjakt = admconfig.productSearchAPI;
var url = admconfig.url;


var routerPost = app.Router()

routerPost.post('/addproducts', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var obj = {
            warehouseid: req.body.warehouseid,
            productname: req.body.productname.toUpperCase(),
            number: req.body.number,
            productnumber: req.body.productnumber
        };

        db.collection(admconfig.productscollection).insertOne(obj, function (err, response) {
            if (err) throw err;
            res.send("response.insertedCount");
            db.close();
        });
    });
});

routerPost.post('/adddelivery', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var obj = {
            productid: req.body.productid,
            productname: req.body.productname,
            owner: req.body.owner,
            warehouseid: req.body.warehouseid,
            serienumber: req.body.serienumber,
            statusDelivery: req.body.statusDelivery,
            date: moment().format("DD.MM.YYYY"),
            number: req.body.number,
            emailAdresse: req.body.emailAdresse,
            companyProductId : req.body.companyproductid
        };

        db.collection(admconfig.deliverycollection).insertOne(obj, function (err, response) {
            if (err) throw err;
            if(req.body.emailCheck == "true"){
                msg.sendmails(String(response.insertedId), req.body.emailAdresse);
            }
            res.send("response.insertedCount");
            db.close();
        });
    });
});

routerPost.post('/editproducts/:productid', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var obj = {
            warehouseid: req.body.warehouseid,
            productname: req.body.productname.toUpperCase(),
            number: req.body.number,
            productnumber: req.body.productnumber
        };
        db.collection(admconfig.productscollection).update({
            _id: ObjectID(req.params.productid)
        }, {
            $set: obj
        }, function (err, response) {
            if (err) throw err;
            res.send("1 document updated");
            db.close();
        });

    });
});

routerPost.post('/setstatusdelivery/:productid', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var obj = {
            statusDelivery: req.body.statusDelivery
        };
        db.collection(admconfig.deliverycollection).update({
            _id: ObjectID(req.params.productid)
        }, {
            $set: obj
        }, function (err, response) {
            if (err) throw err;
            res.send("1 document updated");
            db.close();
        });

    });
});

routerPost.post('/updatenumberproducts/:productid', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var obj = {
            number: req.body.number
        };
        db.collection(admconfig.productscollection).update({
            _id: ObjectID(req.params.productid)
        }, {
            $set: obj
        }, function (err, response) {
            if (err) throw err;
            res.send("1 document updated");
            db.close();
        });

    });
});


routerPost.post('/deletedelivery/:productid', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(admconfig.deliverycollection).deleteOne({
            _id: ObjectID(req.params.productid)
        }, function (err, obj) {
            if (err) throw err;
            console.log("Følgende fjernet fra backend " + req.params.productid);
            res.send("1 document deleted");
            db.close();
        });
    });
});


routerPost.post('/deleteproducts/:productid', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(admconfig.productscollection).deleteOne({
            _id: ObjectID(req.params.productid)
        }, function (err, obj) {
            if (err) throw err;
            console.log("Følgende fjernet fra backend " + req.params.productid);
            res.send("1 document deleted");
            db.close();
        });
    });
});


routerPost.post('/addwarehouse', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var obj = {
            name: req.body.name,
            adresses: req.body.adresses
        };

        db.collection(admconfig.warehousecollection).insert(obj, function (err, response) {
            if (err) throw err;
            res.send(response.insertedIds[0]);
            db.close();
        });
    });
});

routerPost.post('/editwarehouse/:warehouseid', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var obj = {
            name: req.body.name,
            adresses: req.body.adresses
        };
        db.collection(admconfig.warehousecollection).update({
            _id: ObjectID(req.params.warehouseid)
        }, obj, function (err, response) {
            if (err) throw err;
            res.send("1 document updated");
            db.close();
        });
    });
});

routerPost.post('/deletewarehouse/:warehouseid', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(admconfig.warehousecollection).deleteOne({
            _id: ObjectID(req.params.warehouseid)
        }, function (err, obj) {
            if (err) throw err;
            db.close();
        });
    });
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(admconfig.productscollection).deleteMany({
            warehouseid: req.params.warehouseid
        }, function (err, obj) {
            if (err) throw err;
            db.close();
        });
    });
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(admconfig.deliverycollection).deleteMany({
            warehouseid: req.params.warehouseid
        }, function (err, obj) {
            if (err) throw err;
            db.close();
        });
    });
    res.send("Deleted");
});


routerPost.get('/productsearchonline/:productname', function (req, res) {
    var product = req.params.productname;
    getJSON(urlPrisjakt + product, function (error, response) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var resultsList = [];
            try {
                for (var i = 0, len = response.message.product.items.length; i < len; i++) {
                    resultsList.push({
                        "name": response.message.product.items[i].name
                    });
                }
            } catch (e) {
                //Ingen resultater funnet.
            }
            res.send({
                "result": resultsList
            });
        });
    });
});

module.exports = routerPost
