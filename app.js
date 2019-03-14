const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');
const {
  error400, routeNotFound, methodNotFound, error422, error500,
} = require('./errors/errors.js');

const app = express();
app.use(bodyParser.json());


app.use('/api', apiRouter);
app.all('/*', routeNotFound);

app.use(methodNotFound);
app.use(error400);
app.use(error422);
app.use(routeNotFound);
app.use(error500);

module.exports = app;
