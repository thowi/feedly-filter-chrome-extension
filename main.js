const model = new Model();
const feedly = new Feedly();

function installFilter() {
  log('Installing filter UI.');

  // Remove existing filter elements.
  document.querySelectorAll('.feedly-filter').forEach(filter => filter.remove());

  // Create and append new filter element.
  const filter = new Filter(feedly, model);
  document.body.appendChild(filter.element);

  log('Filter UI installed.');
}

function onFeedChanged() {
  installFilter();
}
feedly.addEventListener(Feedly.EventType.FEED_CHANGED, onFeedChanged);
