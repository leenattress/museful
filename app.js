const express = require('express')
const app = express()
const path = require('path');
const logger = require('morgan');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const musings = {
getList() {},
getOne() {},
create() {}
}


// get a paginated list of musings
app.get('/musings', (req, res) => res.send('Hello World!'));

// get a single musing
app.get('/musings/:id', (req, res) => res.send('Hello World!'));

// create a musing
app.post('/musings', (req, res) => res.send('Hello World!'));

// update a musing
app.put('/musings', (req, res) => res.send('Hello World!'));

module.exports = app;
