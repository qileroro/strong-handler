# strong-handler
Strengthen the normal handler function

1. Support for the promise handler or the non-promise handler
2. Non-promise handler are converted to promise handler
3. Support handler return null/string as response output
4. Support timeout

Handler returns:
- undefinde  ---- do nothing
- null/empty string   ---- 204 response
- string   ---- string as response
- other   ----- reject


Example
============

```javascript
const http = require('http');
const strengthan = require('strong-handler');

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
```
