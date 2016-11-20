function installFilterIntoActionBar(filter, actionBar) {
  log('Installing into action bar:', actionBar)
  actionBar.insertBefore(filter.element, actionBar.firstChild);
}

var model = new Model();
var feedly = new Feedly();

// The first two action bars are hidden in recent Feedly versions.
waitUntil(feedly.getMainActionBar.bind(feedly), function(actionBar) {
  installFilterIntoActionBar(new Filter(feedly, model), actionBar);
});
waitUntil(feedly.getFloatingActionBar.bind(feedly), function(actionBar) {
  installFilterIntoActionBar(new Filter(feedly, model), actionBar);
});
// While the following ones are used.
waitUntil(feedly.getMainActionBarFx.bind(feedly), function(actionBar) {
  installFilterIntoActionBar(new Filter(feedly, model), actionBar);
});
waitUntil(feedly.getFloatingActionBarFx.bind(feedly), function(actionBar) {
  installFilterIntoActionBar(new Filter(feedly, model), actionBar);
});
