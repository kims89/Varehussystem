module.exports = {
    //Mongodb
    'url' : 'mongodb://localhost:27017/inityvarehus',
    //Mongodb readonly
    'readonlyurl' : 'mongodb://localhost:27017/inityvarehus',
    //API for prisjakt. Ikke endre dette om du ikke vet hva du gjør.
    'productSearchAPI' : "https://www.prisjakt.no/ajax/server.php?class=Search_Supersearch&method=search&skip_login=1&modes=product&limit=20&q=",
    //Mongodb collection for products
    'productscollection' : "products",
    //Mongodb collection for warehus
    'warehousecollection' : "warehouse",
    //Mongodb collection for delivery
    'deliverycollection' : " delivery",
    //Passord for pålogging
    'password' : "p",
    //Brukernavn for pålogging
    'username' : "admin",
    //Brukernavn smtp
    'mailusername' : "sporing@domene.net",
    //Passord smtp
    'mailpassword' : "pa$$w0rd",
    //servernavn smtp
    'mailhost' : "smtp.domain.com",
    //domene for varehus
    'webdomain' : "http://localhost:8080/",
    //Skal det være mulig å sende smtp meldinger til bruker/kunder. Boolean (True/False er det eneste som fungere)
    'emailnotification' : false,
    'companyproductid' : true,
    'portweb' : 8087
};

