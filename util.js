var ENABLE_LOGGING = true;


function compareNumerically(a, b) {
  return a - b;
}


function waitUntil(closure, callback) {
  var result = closure();
  if (result) {
    callback(result);
  } else {
    setTimeout(waitUntil.bind(null /* this */, closure, callback), 100);
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
