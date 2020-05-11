// ROUTE HANDLERS
const webRoute = require('./routes/frontend/web');
const backendRoute = require('./routes/backend/web');
const authRoute = require('./routes/backend/auth');
const pageNotFound = require('./middlewares/404');

const server = require('./helpers/server');
const db = require('./helpers/db');
const jwt = require('./helpers/jwt');
const expressSession = require('express-session');
const methodOverride = require('method-override')
const express = require('express');
const app = express();

if(!jwt.jwtPrivateKey()) {
    console.log("FATAL ERROR: JWT Private Key Is Not Defined!");
    process.exit(1);
}

db.connect();
// Use the session middleware
app.use(expressSession({ secret: 'keyboard cat', cookie: { }}));
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE
app.use(express.static('public'));
app.use(express.static('media'));
app.use(express.urlencoded({extended : false}));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(webRoute);
app.use(authRoute);
app.use(backendRoute);
app.use(pageNotFound);


server.start(app);