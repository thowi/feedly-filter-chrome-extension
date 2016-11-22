var model = new Model();
var feedly = new Feedly();

function installFilterIntoActionBar(filter, actionBar) {
  log('Installing into action bar:', actionBar)
  actionBar.insertBefore(filter.element, actionBar.firstChild);
}

// The main action bar is only created once.
waitUntil(feedly.getMainActionBar.bind(feedly), function(actionBar) {
  installFilterIntoActionBar(new Filter(feedly, model), actionBar);
});

// The floating action bar is re-created for each feed.
function onFeedChanged() {
  waitUntil(feedly.getFloatingActionBar.bind(feedly), function(actionBar) {
    installFilterIntoActionBar(new Filter(feedly, model), actionBar);
  });
}
feedly.addEventListener(Feedly.EventType.FEED_CHANGED, onFeedChanged);
