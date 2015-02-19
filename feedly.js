/**
 * Abstraction over the Feedly UI.
 */
function Feedly() {
  this.lastUrl = null;

  waitUntil(this.getTitleBar.bind(this), function(titleBar) {
	  // Use the title bar to detect a change of the selected feed.
    titleBar.addEventListener('DOMSubtreeModified', function() {
      if (location.href != this.lastUrl) {
        this.lastUrl = location.href;
        this.onFeedChanged();
      }
    }.bind(this));
  }.bind(this));
}
Feedly.prototype = new EventTargetImpl();


Feedly.EventType = {
  FEED_CHANGED: 'feed-changed',
  FEED_ITEMS_LOADED: 'feed-items-loaded'
};


Feedly.prototype.getActionBar = function() {
  return document.querySelector('.pageActionBar');
};


Feedly.prototype.getTitleBar = function() {
  return document.getElementById('feedlyTitleBar');
};


Feedly.prototype.getItemContainer = function() {
  return document.getElementById('section0_column0');
};


Feedly.prototype.getItemRows = function() {
  return Array.prototype.slice.call(this.getItemContainer().children);
};


Feedly.prototype.getPopularityForRow = function(row) {
  var popularityElement = row.querySelector('.recommendationInfo span');
  return parseInt(popularityElement.getAttribute('data-engagement'));
};


Feedly.prototype.getPopularities = function() {
  return this.getItemRows().map(this.getPopularityForRow);
};


Feedly.prototype.isFeedFullyLoaded = function() {
  var fullyLoadedElement = document.getElementById('fullyLoadedFollowing');
  return fullyLoadedElement.style.display == 'block';
};


Feedly.prototype.loadMoreItems = function() {
  document.body.scrollTop = 1000000;
};


Feedly.prototype.scrollToTop = function() {
  document.body.scrollTop = 0;
};


Feedly.prototype.onFeedChanged = function() {
  // Notify listeners.
  log('FEED_CHANGED');
  this.dispatchEvent(new Event(Feedly.EventType.FEED_CHANGED));
  // Wait until the items are loaded.
  waitUntil(this.getItemContainer.bind(this), function(itemContainer) {
	  log('FEED_ITEMS_LOADED');
    this.dispatchEvent(new Event(Feedly.EventType.FEED_ITEMS_LOADED));
    // Listen for more items to be loaded.
    // The DOMSubtreeModified is fired many times, so we throttle the callback.
    var throttle = new Throttle();
    itemContainer.addEventListener('DOMSubtreeModified', function() {
      throttle.fire(function() {
			  log('FEED_ITEMS_LOADED');
        this.dispatchEvent(new Event(Feedly.EventType.FEED_ITEMS_LOADED));
      }.bind(this));
    }.bind(this));
  }.bind(this));
};


Feedly.prototype.filterRows = function(threshold) {
  this.getItemRows().forEach(function(row) {
    var popularity = this.getPopularityForRow(row);
    row.style.display = popularity >= threshold ? '' : 'none';
  }, this);
};
