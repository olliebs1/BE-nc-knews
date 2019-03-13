const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/apiRouter');

const app = express();
app.use(bodyParser.json());


app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.log(err);
});


module.exports = app;
