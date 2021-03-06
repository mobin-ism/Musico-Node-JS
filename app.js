// ROUTE HANDLERS
const webRoute = require('./routes/frontend/web');
const backendRoute = require('./routes/backend/web');
const authRoute = require('./routes/backend/auth');
const artistRoute = require('./routes/backend/artist');
const albumRoute = require('./routes/backend/album');
const trackRoute = require('./routes/backend/track');
const userRoute = require('./routes/backend/user');
const galleryRoute = require('./routes/backend/gallery');
const settingsRoute = require('./routes/backend/settings');
const pageNotFound = require('./middlewares/404');

const server = require('./helpers/server');
const db = require('./helpers/db');
const jwt = require('./helpers/jwt');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const methodOverride = require('method-override')
const authorization = require('./middlewares/authorization');
const express = require('express');
const app = express();

if(!jwt.jwtPrivateKey()) {
    console.log("FATAL ERROR: JWT Private Key Is Not Defined!");
    process.exit(1);
}

db.connect();
// Use the session middleware
app.use(expressSession({ 
    secret: 'keyboard cat',
    resave: false,
    store : new MongoStore({
        mongooseConnection : db.mongoose.connection, 
        autoRemove: 'interval',
        autoRemoveInterval: 24 * 60 // In minutes. Default
    }),
    cookie: { maxAge : 180 * 60 * 1000 }
}));
app.use(methodOverride('_method')); // override with POST having ?_method=DELETE
app.use(express.static('public'));
app.use(express.static('media'));
app.use(express.urlencoded({extended : false}));
app.set('view engine', 'ejs');
app.set('views', 'views');

// ROUTES
app.use(authRoute);
app.use(webRoute);
app.use(backendRoute);
app.use('/artist', artistRoute);
app.use('/album', albumRoute);
app.use('/track', trackRoute);
app.use('/user', authorization, userRoute);
app.use('/gallery', authorization, galleryRoute);
app.use('/settings', authorization, settingsRoute);
app.use(pageNotFound);


server.start(app);