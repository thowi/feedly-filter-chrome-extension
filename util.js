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
	ENABLE_LOGGING && console.log(message);
}
