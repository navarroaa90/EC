var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload= require('express-fileupload');
var passport = require('passport');

// connect .env
require('dotenv').config();

var app = express();

//connect to mongodb
require('./config/database');

var index = require('./routes/index');
var aboutMe = require('./routes/aboutme');
var referral = require('./routes/referral');
var contactUs = require('./routes/contactus');
var products = require('./routes/products');
var video = require('./routes/video');
var cart = require('./routes/cart');
var adminPages = require('./routes/admin_pages');
var adminCategories = require('./routes/admin_categories');
var adminProducts = require('./routes/admin_products');

var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Set global errors variable
app.locals.errors = null;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Get Category Model
var Category = require('./models/category');

// Get all categories to pass to header.ejs
Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
});


// Express fileupload middleware
app.use(fileUpload());


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Express Session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

// Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root   = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParm += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg :msg,
      value: value
    };
  },
  customValidators: {
    isImage: function(value, filename) {
        var extension = (path.extname(filename)).toLowerCase();
        switch(extension) {
        case '.jpg':
            return '.jpg';
          case '.jpeg':
            return '.jpeg';
          case '.png':
            return '.png';
          case '':
            return '.jpg';
          default:
            return false;
      }
    }
  }
}));

// express messages & connect flash middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Passport config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();

});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin/pages', adminPages);
app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/', index);
app.use('/aboutme', aboutMe);
app.use('/referral', referral)
app.use('/contactus', contactUs);
app.use('/products', products);
app.use('/video', video);
app.use('/cart', cart);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
