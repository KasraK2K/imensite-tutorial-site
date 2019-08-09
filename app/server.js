//------------------------------
//           MODULES
//------------------------------
var express = require('express');
var app = express();
var http = require('http').createServer(app); // create http from app for socket.io
var io = require('socket.io').listen(http); // socket.io for chat
var reload = require('reload'); // it'd to stomstion reload page after any code change
var path = require('path'); // i using it for call directory separator
var bodyParser = require('body-parser'); // this module need option to handle request data
var expressValidator = require('express-validator'); // this module need option to handle errors
var mongoose = require('mongoose'); // database mongodb
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require('method-override'); // look in urlencoded POST bodies and delete it
var data = require('./data/data'); // sample json data just for test

//------------------------------
// MONGOOSE CONNECTION SETTING
//------------------------------
mongoose.set('useNewUrlParser', true); // for remove DeprecationWarning
mongoose.set('useCreateIndex', true); // for remove DeprecationWarning
mongoose.set('useFindAndModify', false); // for remove DeprecationWarning
mongoose.connect('mongodb://localhost:27017/ImenSiteData');

//------------------------------
//         SET SETTING
//------------------------------
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', __dirname + path.sep + 'views');

//------------------------------
//       LOCAL VARIABLE
//------------------------------
app.locals.data = data;
app.locals.siteName = 'ایمن سایت';

//------------------------------
//       GLOBAL VARIABLE
//------------------------------
global.persianCharacters = [
    'ا', 'آ', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی', 'ء', 'ي', 'ئ', '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
]; // all persian character as array

//------------------------------
//        MIDDLEWARE
//------------------------------
// static folder
app.use(express.static(__dirname + path.sep + 'public'));
// body parser to get request body as json
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
// express request validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
})); // validation custom error handeling
// passport Authentication
app.use(cookieParser());
app.use(session({
    secret: 'imensite',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });
// methodOverride
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }
})); // look in urlencoded POST bodies and delete it
// custome
// app.use(function (req, res, next) { console.log('middleware for server'); next(); });

//------------------------------
//           EVENTS
//------------------------------
io.on('connection', function (socket) {
    console.log('use is connected');

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });

    socket.on('user send info', function (data) {
        console.log(data);
    })

    socket.on('disconnect', function () {
        console.log('user is disconnected');
    })
});

//------------------------------
//       BACKEND ROUTES
//------------------------------

var dashboard = require('./routes/dashboard/dashboard');
app.use('/dashboard', dashboard);

//------------------------------
//       FRONTEND ROUTES
//------------------------------
var public = require('./routes/public/public');
app.use('/', public);
app.get('/api', function(req, res) { res.json(data) });

//------------------------------
//       SERVER & RELOAD
//------------------------------
var server = http.listen(app.get('port'), function() {
    console.log('server is running at http://localhost:' + app.get('port') + '/');
});
reload(app); // reload application on change css,js,ejs,json
