module.exports = {
    //Mongodb
    'url' : 'mongodb://mongo:27017/inityvarehus',
    //Mongodb readonly
    'readonlyurl' : 'mongodb://mongo:27017/inityvarehus',
    //API for prisjakt. Ikke endre dette om du ikke vet hva du gjør.
    'productSearchAPI' : "https://www.prisjakt.no/ajax/server.php?class=Search_Supersearch&method=search&skip_login=1&modes=product&limit=20&q=",
    //Mongodb collection for products
    'productscollection' : "products",
    //Mongodb collection for warehus
    'warehousecollection' : "warehouse",
    //Mongodb collection for delivery
    'deliverycollection' : " delivery",
    //Passord for pålogging
    'password' : process.env.ADM_PASSWORD,
    //Brukernavn for pålogging
    'username' : process.env.ADM_USERNAME,
    //Brukernavn smtp
    'mailusername' : process.env.MAILUSERNAME,
    //Passord smtp
    'mailpassword' : process.env.MAILUSERPASSWORD,
    //servernavn smtp
    'mailhost' : process.env.SMTP,
    //domene for varehus
    'webdomain' : process.env.DOMAIN,
    //Skal det være mulig å sende smtp meldinger til bruker/kunder. Boolean (True/False er det eneste som fungere)
    'emailnotification' : process.env.EMAILNOTIFICATION,
    'companyproductid' : process.env.PRODUCTID,
    'portweb' : process.env.WEBPORT
};

