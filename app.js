const express = require('express');
const app = express();
const web = require('./routes/frontend/web');
const pageNotFound = require('./middlewares/404');
const server = require('./helpers/server');
const commonRoute = require('./routes/backend/common');
const flash = require('express-flash-messages')();
const session = require('express-session');
app.use(session({ cookie: { maxAge: 60000 }, 
                  secret: 'woot',
                  resave: false, 
                  saveUninitialized: false}));
app.use(flash);

app.use(express.static('public'));
app.use(express.static('media'));
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(web);
app.use(commonRoute);
app.use(pageNotFound);

server.start(app);