const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const breadcrumb = require('express-url-breadcrumb');
const multer = require('multer');

const app = express();

// Load Routes
const students = require('./routes/students');
const users = require('./routes/users');
const courses = require('./routes/courses');
const fees = require('./routes/fee-mgmt');
const api = require('./routes/api');
const uploads = require('./routes/uploads');
const marksAndGrades = require('./routes/marks-and-grades');
// Passport Config.
require('./config/passport')(passport);

// Connecting to MongoDB...
const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/student-mgmt-sys', {
//     useNewUrlParser: true
// }).then(() => console.log('Connected to MongoDB Server...')).catch(err => console.error('Error occured connecting to MongoDB...', err));

const mongoString = "mongodb://icwchifz:icwchifz@cluster0-shard-00-00.de6a0.mongodb.net:27017,cluster0-shard-00-01.de6a0.mongodb.net:27017,cluster0-shard-00-02.de6a0.mongodb.net:27017/student-mgmt-sys?ssl=true&replicaSet=atlas-4xm6wq-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(mongoString, {useNewUrlParser: true})

mongoose.connection.on("error", function(error) {
  console.log(error)
})

mongoose.connection.on("open", function() {
  console.log("Connected to MongoDB database.")
})

// Load Helpers
const {
    paginate,
    select,
    if_eq,
    select_course
} = require('./helpers/customHelpers');

const {
    ensureAuthenticated,
    isLoggedIn
} = require('./helpers/auth');

// Express Handlebars Middleware.

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        paginate: paginate,
        select: select,
        if_eq: if_eq,
        select_course: select_course
    }
}));

app.set('view engine', 'handlebars');

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express URL Breadcrumbs
app.use(breadcrumb());

// Body Parser Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// Method Override
app.use(methodOverride('_method'));

// Express Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware.
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global Variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.user = req.user || null;
    next();
});

// Home Route
app.get('/', [isLoggedIn], (req, res) => {
    res.render('home', {
        title: 'Welcome',
        breadcrumbs: false,
        layout: 'home'
    });
});

// Dashboard Route
app.get('/dashboard', [ensureAuthenticated], (req, res) => {
    //console.log(req.originalUrl);
    res.render('dashboard', {
        title: 'Dashboard',
        breadcrumbs: true
    });
});

app.get('/api', (req, res) => {
    res.render('api');
})

app.get('/errors', (req, res) => {
    res.render('errors', {
        title: '404 - Page Not Found.'
    });
});

// Use Routes
app.use('/students', students);
app.use('/users', users);
app.use('/courses', courses);
app.use('/fee-management', fees);
app.use('/api', api);
app.use('/uploads', uploads);
app.use('/marks-and-grades', marksAndGrades);

// Listening on Port:5000
const port = process.env.PORT || 3000;
// const port = process.env.NODE_ENV || 5000;
app.set('port', port);
app.listen(port, () => console.log(`Server started on port : ${port}`));