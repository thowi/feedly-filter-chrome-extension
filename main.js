var feedly = new Feedly();
var filter = new Filter(feedly);
waitUntil(feedly.getActionBar.bind(feedly), function(actionBar) {
  actionBar.insertBefore(filter.element, actionBar.firstChild);
});
