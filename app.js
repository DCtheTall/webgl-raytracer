const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`));

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

app.get('/', (req, res) => res.render('index'));

module.exports = app;
