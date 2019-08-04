var express = require('express');
var app = express();

app.post('/linewebhook', function(req, res) {
    console.log('-----------------------------')
    console.log(req.body)
  });

module.exports = app;