'use strict';

function strengthan(handler, timeout) {
  timeout = timeout || handler.timeout;
  var timeoutfunc = (_, reject) => {
    setTimeout(() => { reject(new Error('timeout')); }, timeout);
  };

  return (req, res) => {
    var timeoutPromise = timeout ? new Promise(timeoutfunc) : null;
    var successPromise = new Promise((resolve, reject) => {
      res.on('finish', () => {resolve()});

      var handlerResult = handler(req, res);
      var isPromise = handlerResult != undefined && handlerResult['then'];
      if (isPromise) {
        handlerResult.then((promiseHandlerResult) => {
          processhandlerResult(promiseHandlerResult, res, reject);
        }).catch((e) => {
          reject(e);
        });
      } else {
        processhandlerResult(handlerResult, res, reject);
      }
    });
    return Promise.race([successPromise, timeoutPromise]);
  };
}

function processhandlerResult(handlerResult, res, reject) {
  try {
    if (handlerResult === undefined) {
      return;
    } else if (handlerResult === null || handlerResult === '') {
      try {
        res.statusCode = 204;
      } catch { }
      res.end();
    } else if (handlerResult.constructor === String) {
      res.end(handlerResult);
    } else {
      reject(new Error(`Expect to return string/null/undefined, but return unexpected: ${typeof(handlerResult)}`));
    }
  } catch { }
}

module.exports = strengthan;
