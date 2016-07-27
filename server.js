var express = require('express');
var app = express();
var port = process.env.PORT || 8085;

// Handling routes
app.use(express.static(__dirname + '/'));

// Run the server
var server = app.listen(port, function(){
  console.log('Listening at http://%s:%s', server.address().address, server.address().port);
});