const ENABLE_LOGGING = true;


function compareNumerically(a, b) {
  return a - b;
}


function waitUntil(closure, callback, description = '(anonymous wait)', timeOutMillis = Number.MAX_VALUE) {
  const result = closure();
  if (result) {
    callback(result);
  } else if (timeOutMillis >= 0) {
    setTimeout(waitUntil.bind(
        null /* this */, closure, callback, description, timeOutMillis - 100),
        100);
  } else {
    log('Timeout for ' + description);
    throw new Error('Timeout for ' + description);
  }
}


function findElementWithText(nodeList, text) {
  return Array.from(nodeList).find(child => child.textContent == text);
}


function log(message) {
  const args = Array.from(arguments);
  args.unshift('Feedly Filter:');
	ENABLE_LOGGING && console.log.apply(console.log, args);
}


function parseEngagementCountString(countString) {
  return parseInt(countString.replace('K', '000').replace('M', '000000'));
}
