const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mySQLStore = require('express-mysql-session');
const passport =  require('passport');

const { database } = require('./keys');

// Init
const app = express();
require('./lib/cpassport'); // llama al método

// Sett
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Midd
app.use(session({
    secret: 'k1n0c0ntrol',
    resave: false,
    saveUninitialized: false,
    store: new mySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); // Aceptar los datos enviados desde formularios
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Global
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.cuser = req.user;
    next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/links'));
app.use(require('./routes/auth'));
app.use('/control', require('./routes/users')); // Agregar usuarios desde el control

// Public
app.use(express.static(path.join(__dirname, 'public')));

// Start
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});