// TODO: Use popularity histogram as the values are not distributed linearly.
// TODO: Re-filter when more rows are loaded.
// TODO: When switching feeds automatically load all entries.

/**
 * The UI to filter the items.
 */
function Filter(feedly) {
  this.feedly = feedly;

  this.element = document.createElement('div');

  this.min = document.createElement('span');
  this.max = document.createElement('span');

  this.range = document.createElement('input');
  this.range.type = 'range';

  this.element.appendChild(this.min);
  this.element.appendChild(this.range);
  this.element.appendChild(this.max);

  this.feedly.addEventListener(
      Feedly.EventType.FEED_ITEMS_LOADED,
      this.onFeedItemsLoaded.bind(this));
}


Filter.prototype.setRange = function(min, max) {
  this.min.innerText = min;
  this.max.innerText = max;
  this.range.min = min;
  this.range.max = max;
  this.range.step = (max - min) / 10;
  this.range.addEventListener('input', this.onRangeChanged.bind(this));
};


Filter.prototype.onRangeChanged = function() {
  this.feedly.filterRows(this.range.value /* threshold */);
};


Filter.prototype.onFeedItemsLoaded = function(event) {
  var popularities = this.feedly.getPopularities();
  this.setRange(
      popularities[0] /* min */,
      popularities[popularities.length - 1] /* max */);
};



function injectUi(element, actionBar) {
  actionBar.insertBefore(element, actionBar.firstChild);
}


function init() {
  var feedly = new Feedly();
  var filter = new Filter(feedly);
  waitUntil(feedly.getFeedTitle, function(titleBar) {
    var actionBar = feedly.getActionBar();
    injectUi(filter.element, actionBar);
  });
}


init();
