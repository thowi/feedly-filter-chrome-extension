function installFilterIntoActionBar(filter, actionBar) {
  actionBar.insertBefore(filter.element, actionBar.firstChild);
}

var feedly = new Feedly();
waitUntil(feedly.getMainActionBar.bind(feedly), function(mainActionBar) {
  installFilterIntoActionBar(new Filter(feedly), mainActionBar);
  installFilterIntoActionBar(new Filter(feedly), feedly.getFloatingActionBar());
});
