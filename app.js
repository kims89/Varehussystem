var express = require('express');
var getJSON = require('get-json');
var request = require('request');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var cookieSession = require('cookie-session');
var moment = require('moment');
var basicauth = require('basicauth-middleware');
var msg = require('./config/mail.js');

var admconfig = require('./config/adminInfo.js');
var url = admconfig.url;
var urlPrisjakt = admconfig.productSearchAPI;
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

moment.locale("nb");
var app = express();

app.set('view engine', 'ejs');
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('pub'));

app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY1, process.env.COOKIE_KEY2],
    maxAge: 24 * 60 * 60 * 1000
}));

app.get('/', basicauth(admconfig.username, admconfig.password), function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(admconfig.warehousecollection).find({}).toArray(function (err, result) {
            if (err) throw err;
            res.render('index', {
                result: result
            });
            db.close();
        });
    });
});

app.get('/warehouse/:warehouseid', basicauth(admconfig.username, admconfig.password), function (req, res) {
    var idwarehouse = req.params.warehouseid;
    if (ObjectID.isValid(req.params.warehouseid) == true) {
        MongoClient.connect(url, function (errWarehouse, dbWarehouse) {
            if (errWarehouse) throw errWarehouse;
            try {
                var queryWarehouse = {
                    _id: ObjectID(idwarehouse)
                };
                dbWarehouse.collection(admconfig.warehousecollection).find(queryWarehouse).toArray(function (errWarehouse, resultWarehouse) {
                    var warehousename = resultWarehouse[0].name;
                    if (resultWarehouse.length == 1) {
                        MongoClient.connect(url, function (errProduct, dbProduct) {
                            var query = {
                                warehouseid: idwarehouse
                            };
                            dbProduct.collection(admconfig.productscollection).find(query).toArray(function (err, result) {
                                if (err) throw err;
                                res.render('productindex', {
                                    result: result,
                                    warehouseid: idwarehouse,
                                    warehousename: warehousename,
                                    emailnotification : admconfig.emailnotification
                                });
                                dbProduct.close();
                            });
                        });
                    }
                });
            } catch (err) {
                res.render('errorDelivery', {
                    fault: "Finner ikke varehus",
                    faultcode: 1
                });
            }
            dbWarehouse.close();
        });
    } else {
        res.render('errorDelivery', {
            fault: "Feil på varehusnummeret",
            faultcode: 3
        });
    }
});

app.get('/api/searchproducts/:search', basicauth(admconfig.username, admconfig.password), function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var regexp = new RegExp(req.params.search.toUpperCase());
        db.collection(admconfig.productscollection).find({
            productname: regexp
        }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            res.send(result);
        });
    });
});

app.get('/api/getproducts/:id', basicauth(admconfig.username, admconfig.password), function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(admconfig.productscollection).find({
            _id: ObjectID(req.params.id)
        }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            res.send(result);
        });
    });
});

app.get('/api/getdelivery/:id', basicauth(admconfig.username, admconfig.password), function (req, res) {
    var idProduct = req.params.id;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(admconfig.deliverycollection).find({
            productid: idProduct
        }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            if (result.length == 0) {
                console.log(Date() + ": Finner ingen utleveringer");
                res.render('errorDelivery', {
                    fault: "Finner ingen utleveringer",
                    faultcode: 2
                });
            } else {
                res.render('deliveryindex', {
                    result: result,
                    productid: idProduct
                });
            }
        });
    });

});

app.get('/api/getalldeliverys/:id', basicauth(admconfig.username, admconfig.password), function (req, res) {
    var idProduct = req.params.id;
    if (ObjectID.isValid(req.params.id) == true) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            db.collection(admconfig.deliverycollection).find({
                warehouseid: idProduct
            }).toArray(function (err, result) {
                if (err) throw err;
                db.close();
                if (result.length == 0) {
                    res.render('errorDelivery', {
                        fault: "Finner ingen utleveringer",
                        faultcode: 2
                    });
                } else {
                    res.render('deliveryindex', {
                        result: result,
                        productid: idProduct
                    });
                }
            });
        });

    } else {
        res.render('errorDelivery', {
            fault: "Feil på utleveringsnummeret",
            faultcode: 3
        });
    }
});


app.get('/track/:id', function (req, res) {
    if (ObjectID.isValid(req.params.id) == true) {
        MongoClient.connect(admconfig.readonlyurl, function (err, db) {
            if (err) throw err;
            db.collection(admconfig.deliverycollection).find({
                _id: ObjectID(req.params.id)
            }).toArray(function (err, result) {
                if (err) throw err;
                db.close();
                if (result.length == 0) {
                    res.render('errorDelivery', {
                        fault: "Finner ikke sporingsnummeret",
                        faultcode: 1
                    });
                } else {
                    res.render('trackindex', {
                        result: result
                    });
                }
            });
        });
    } else {
        res.render('errorDelivery', {
            fault: "Feil på sporingsnummeret",
            faultcode: 3
        });
    }
});

app.get('/api/getwarehouse/:id', basicauth(admconfig.username, admconfig.password), function (req, res) {
    if (ObjectID.isValid(req.params.id) == true) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            db.collection(admconfig.warehousecollection).find({
                _id: ObjectID(req.params.id)
            }).toArray(function (err, result) {
                if (err) throw err;
                db.close();
                res.send(result);
            });
        });
    } else {
        res.render('errorDelivery', {
            fault: "Feil på varehusnummeret",
            faultcode: 3
        });
    }
});



app.post('/api/addproducts', basicauth(admconfig.username, admconfig.password), function (req, res) {
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

app.post('/api/adddelivery', basicauth(admconfig.username, admconfig.password), function (req, res) {
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
            emailAdresse: req.body.emailAdresse
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

app.post('/api/editproducts/:productid', basicauth(admconfig.username, admconfig.password), function (req, res) {
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

app.post('/api/setstatusdelivery/:productid', basicauth(admconfig.username, admconfig.password), function (req, res) {
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

app.post('/api/updatenumberproducts/:productid', basicauth(admconfig.username, admconfig.password), function (req, res) {
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


app.post('/api/deletedelivery/:productid', basicauth(admconfig.username, admconfig.password), function (req, res) {
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


app.post('/api/deleteproducts/:productid', basicauth(admconfig.username, admconfig.password), function (req, res) {
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


app.post('/api/addwarehouse', basicauth(admconfig.username, admconfig.password), function (req, res) {
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

app.post('/api/editwarehouse/:warehouseid', basicauth(admconfig.username, admconfig.password), function (req, res) {
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

app.post('/api/deletewarehouse/:warehouseid', basicauth(admconfig.username, admconfig.password), function (req, res) {
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


app.get('/api/productsearchonline/:productname', basicauth(admconfig.username, admconfig.password), function (req, res) {
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

var port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Live! ' + Date())
});