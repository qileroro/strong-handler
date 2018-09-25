const http = require('http');
const strengthan = require('./index');

function handler(req, res) {
  if (req.url === '/timeout') {
  } else if (req.url === '/null') {
    return null;
  } else if (req.url === '/error') {
    throw new Error('fail');
  } else {
    return 'hello world';
  }
}

var strongHandler = strengthan(handler, 5000);

function httpHandler(req, res) {
  strongHandler(req, res).catch((e) => {
    console.log(e);
    res.statusCode = 500;
    res.end('Server Error');
  });
};

http.createServer(httpHandler).listen(3000);
