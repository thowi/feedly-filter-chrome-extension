var ENABLE_LOGGING = true;


function compareNumerically(a, b) {
  return a - b;
}


function waitUntil(closure, callback) {
  waitUntil(closure, callback, Number.MAX_VALUE);
}


function waitUntil(closure, callback, timeOutMillis) {
  waitUntil(closure, callback, '(anonymous wait)', timeOutMillis);
}

function waitUntil(closure, callback, description, timeOutMillis) {
  var result = closure();
  if (result) {
    callback(result);
  } else if (timeOutMillis >= 0) {
    setTimeout(waitUntil.bind(
        null /* this */, closure, callback, description, timeOutMillis - 100),
        100);
  } else {
    log('Timeout for ' + description);
  }
}


function log(message) {
  var args = Array.from(arguments);
  args.unshift('Feedly Filter:');
	ENABLE_LOGGING && console.log.apply(console.log, args);
}


function parseEngagementCountString(countString) {
  return parseInt(countString.replace('K', '000').replace('M', '000000'));
}
