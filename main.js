var model = new Model();
var feedly = new Feedly();

function installFilter() {
  log('Installing filter UI.')
  document.querySelectorAll('.feedly-filter').forEach(function(filter) {
    filter.remove();
  });
  var filter = new Filter(feedly, model);
  document.body.appendChild(filter.element);
}

function onFeedChanged() {
  installFilter();
}
feedly.addEventListener(Feedly.EventType.FEED_CHANGED, onFeedChanged);
