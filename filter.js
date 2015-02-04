// TODO: Styling.
// TODO: Cleanup unused stuff. Also in the manifest etc.
// TODO: Submit to Chrome Web Store.
// TODO: When switching feeds automatically load all entries.
// TODO: When the popularity buckets change, use the nearest neighbor bucket.

/**
 * The UI to filter the items.
 */
function Filter(feedly) {
  this.feedly = feedly;
  this.popularities = [];

  this.element = document.createElement('div');

  this.min = document.createElement('span');
  this.max = document.createElement('span');

  this.range = document.createElement('input');
  this.range.type = 'range';
  this.range.min = 0;
  this.range.max = Filter.NUM_POPOLARITY_BUCKETS - 1;
  this.range.step = 1;
  this.range.value = 0;
  this.range.addEventListener('input', this.filterRows.bind(this));

  this.element.appendChild(this.min);
  this.element.appendChild(this.range);
  this.element.appendChild(this.max);

  this.feedly.addEventListener(
      Feedly.EventType.FEED_CHANGED,
      this.onFeedChanged.bind(this));
  this.feedly.addEventListener(
      Feedly.EventType.FEED_ITEMS_LOADED,
      this.onFeedItemsLoaded.bind(this));
}


Filter.NUM_POPOLARITY_BUCKETS = 50;


Filter.prototype.setRange = function(min, max) {
  this.min.innerText = min;
  this.max.innerText = max;
};


Filter.prototype.filterRows = function() {
	var threshold =  this.popularities[this.range.value] || 0;
  this.feedly.filterRows(threshold);
};


Filter.prototype.onFeedChanged = function(event) {
	// Reset filter on feed change.
	this.range.value = 0;
};


Filter.prototype.onFeedItemsLoaded = function(event) {
  var allPopularities = this.feedly.getPopularities();
  this.popularities = this.getPopularityBuckets(allPopularities);
  this.setRange(
      this.popularities[0] /* min */,
      this.popularities[this.popularities.length - 1] /* max */);
  this.filterRows();
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
