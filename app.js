const express = require('express');
const app = express();
const web = require('./routes/frontend/web');
const pageNotFound = require('./middlewares/404');
const server = require('./helpers/server');

app.use(express.static('public'));
app.use(express.static('media'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(web);
app.use(pageNotFound);

server.start(app);