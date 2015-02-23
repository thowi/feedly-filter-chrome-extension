function installFilterIntoActionBar(filter, actionBar) {
  actionBar.insertBefore(filter.element, actionBar.firstChild);
}

var model = new Model();
var feedly = new Feedly();
waitUntil(feedly.getMainActionBar.bind(feedly), function(mainActionBar) {
  installFilterIntoActionBar(
      new Filter(feedly, model),
      mainActionBar);
  installFilterIntoActionBar(
      new Filter(feedly, model),
      feedly.getFloatingActionBar());
});
