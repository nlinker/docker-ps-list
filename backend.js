var express = require('express');
var dparser = require('docker-ps-parser');
var spawn   = require('child_process').spawn;
var app     = express();

app.use(express.static(__dirname));

app.get('/list', function(req, res) {
  var command = spawn('docker', ['ps', '-a']);
  // var command = spawn(__dirname + '/run.sh', [ req.query.env || '' ]);
  var output  = [];
  command.stdout.on('data', function(chunk) {
    output.push(chunk);
  });

  command.on('close', function(code) {
    if (code === 0) {
      // convert output to string
      var buf = '' + Buffer.concat(output);
      var parsed = dparser.parse(buf);
      res.send(parsed);
    } else {
      // when the script fails, generate a Server Error HTTP response
      res.send(500);
    }
  });
});

var port = process.env.PORT || 8081;
app.listen(port);
console.log('Server listening at ' + port);
