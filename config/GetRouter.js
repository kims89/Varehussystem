var app = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var admconfig = require('./adminInfo.js');
var url = admconfig.url;


var router = app.Router()

router.get('/', function (req, res) {
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

router.get('/settings', function (req, res) {
    res.render('settings', {
        settings: admconfig
    });
  });

router.get('/warehouse/:warehouseid', function (req, res) {
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
                                  emailnotification : admconfig.emailnotification,
                                  companyproductid : admconfig.companyproductid
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

router.get('/api/searchproducts/:search', function (req, res) {
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

router.get('/api/getproducts/:id', function (req, res) {
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

router.get('/api/getdelivery/:id', function (req, res) {
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
                  productid: idProduct,
                  companyid: admconfig.companyproductid
              });
          }
      });
  });

});

router.get('/api/getalldeliverys/:id', function (req, res) {
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
                      productid: idProduct,
                      companyid: admconfig.companyproductid
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

router.get('/track/:id', function (req, res) {
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

router.get('/api/getwarehouse/:id', function (req, res) {
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



module.exports = router
