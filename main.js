var feedly = new Feedly();
var filter = new Filter(feedly);
waitUntil(feedly.getFeedTitle.bind(feedly), function(titleBar) {
  var actionBar = feedly.getActionBar();
  actionBar.insertBefore(filter.element, actionBar.firstChild);
});
