var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var cookieSession = require('cookie-session');
var moment = require('moment');
var basicAuth = require('express-basic-auth');
var compression = require('compression');

var admconfig = require('./config/adminInfo.js');
var GetRouter = require('./config/GetRouter');
var PostRouter = require('./config/PostRouter');
var port = process.env.PORT || 8086;

moment.locale("nb");
var app = express();
app.use(compression({ filter: shouldCompress }))
app.use(basicAuth( { authorizer: myAuthorizer, authorizeAsync: true, challenge: true, unauthorizedResponse : {message: 'Bad credentials'} } ))
app.use(helmet());
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('pub'));

//hent alle get-relaterte rutinger
app.use('/', GetRouter)

//Hent alle post-relaterte rutinger
app.use('/api', PostRouter)

app.get('/session-tester', function (req, res, next) {
    // Update views
    req.session.views = (req.session.views || 0) + 1

    // Write response
    res.end(req.session.views + ' views')
  })


app.listen(port, () => {
    console.log('Live! ' + Date())
});

function myAuthorizer(username, password, cb) {
  if (basicAuth.safeCompare(username, admconfig.username ) & basicAuth.safeCompare(password, admconfig.password ))
  return cb(null, true)
else
  return cb(null, false)
}


function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
  }
