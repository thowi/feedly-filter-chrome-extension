// TODO: When the popularity buckets change, use the nearest neighbor bucket.
// TODO: Consider moving more state (this.popularities) and logic
//     (getPopularityBuckets, popularityFilter <-> index conversion) into the
//     model.
// TODO: Fix the memory leaks by un-listening from events.

/**
 * The UI to filter the items.
 */
function Filter(feedly, model) {
  this.feedly = feedly;
  this.model = model;
  this.popularities = [];
  this.lastPositionBeforeLoadingMoreItems = null;

  this.element = document.createElement('div');
  this.element.className = 'feedly-filter';

  this.range = document.createElement('input');
  this.range.className = 'feedly-filter-range';
  this.range.type = 'range';
  this.range.min = 0;
  this.range.max = Filter.NUM_POPOLARITY_BUCKETS - 1;
  this.range.step = 1;
  this.range.value = 0;
  this.range.addEventListener('input', this.onRangeInput.bind(this));

  this.element.appendChild(this.range);

  this.feedly.addEventListener(
      Feedly.EventType.FEED_CHANGED,
      this.onFeedChanged.bind(this));
  this.feedly.addEventListener(
      Feedly.EventType.FEED_ITEMS_LOADED,
      this.onFeedItemsLoaded.bind(this));
  this.model.addEventListener(
      Model.EventType.POPULARITY_FILTER_CHANGED,
      this.onModelChanged.bind(this));
}


Filter.NUM_POPOLARITY_BUCKETS = 100;


Filter.prototype.onRangeInput = function(event) {
  this.model.setPopularityFilter(
      this.range.value / Filter.NUM_POPOLARITY_BUCKETS);
  this.filterRows();
};


Filter.prototype.onFeedChanged = function(event) {
	// Reset filter on feed change.
  this.model.setPopularityFilter(0);
};


Filter.prototype.onFeedItemsLoaded = function(event) {
  var allPopularities = this.feedly.getPopularities();
  this.popularities = this.getPopularityBuckets(allPopularities);
  this.filterRows();
  if (this.feedly.shouldLoadMoreItems()) {
    this.maybeSaveScrollPos();
    // This will trigger another call to onFeedItemsLoaded once loaded.
    this.feedly.loadMoreItems();
  } else {
    this.restoreScrollPos();
  }
};


Filter.prototype.onModelChanged = function() {
  this.range.value =
      this.model.getPopularityFilter() * Filter.NUM_POPOLARITY_BUCKETS;
};


Filter.prototype.filterRows = function() {
  var popularityBucketIndex =
      Math.round(this.model.getPopularityFilter() *
      Filter.NUM_POPOLARITY_BUCKETS);
  var threshold = this.popularities[popularityBucketIndex] || 0;
  this.feedly.filterRows(threshold);
  if (this.feedly.shouldLoadMoreItems()) {
    this.maybeSaveScrollPos();
    // This will trigger a call to onFeedItemsLoaded once loaded.
    this.feedly.loadMoreItems();
  }
};


Filter.prototype.maybeSaveScrollPos = function() {
  if (this.lastPositionBeforeLoadingMoreItems == null) {
    this.lastPositionBeforeLoadingMoreItems = document.body.scrollTop;
  }
};


Filter.prototype.restoreScrollPos = function() {
  if (this.lastPositionBeforeLoadingMoreItems != null) {
    document.body.scrollTop = this.lastPositionBeforeLoadingMoreItems;
  }
  this.lastPositionBeforeLoadingMoreItems = null;
};


/**
 * Takes the whole popularity distribution and returns an array of exactly
 * NUM_POPOLARITY_BUCKETS popularity values. The minimum and maximum popularity is
 * guaranteed to be included. The values in between are sampled.
 */
Filter.prototype.getPopularityBuckets = function(allPopularities) {
	var numBuckets = Filter.NUM_POPOLARITY_BUCKETS;

	var unique = [];
	new Set(allPopularities).forEach(function(value) {
		unique.push(value);
	});

	var sorted = unique.sort(compareNumerically);

	var result = []
	result.push(sorted[0]);
	for (var i = 1; i < numBuckets - 1; i++) {
		var sampledIndex = Math.round(i / (numBuckets - 2) * (sorted.length - 2));
		result.push(sorted[sampledIndex]);
	}
	result.push(sorted[sorted.length - 1]);

	return result;
};
