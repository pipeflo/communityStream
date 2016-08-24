var express = require('express')
    , path = require('path')
    , favicon = require('static-favicon')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , routes = require('./routes/index')
    , api = {}
    , app = express()
    ;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Agrego CORS
app.all('/*', function(req, res, next) {
    
    res.setHeader('Access-Control-Allow-Origin', "http://"+req.headers.host+':3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'origin,Accept,X-Access-Token,X-Key,X-Requested-With,content-type');

  // CORS headers
  //res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  //res.header('Access-Control-Allow-Headers', 'origin,Content-type,Accept,X-Access-Token,X-Key,X-Requested-With');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');

// TODO - Why Do we need this key ?
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

/*var authRoutes = require('./routes/auth')(passport);
app.use('/auth/ibm-connections-cloud', authRoutes);*/

//JSON API
api.activityStream = require('./routes/api/v1/activityStream');
app.use('/api/v1/activitystream', api.activityStream);
api.auth = require('./routes/api/v1/auth');
app.use('/api/v1/auth', api.auth);
api.communities = require('./routes/api/v1/communities');
app.use('/api/v1/communities', api.communities);
api.watson = require('./routes/api/v1/watson');
app.use('/api/v1/watson', api.watson);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

module.exports = app;
