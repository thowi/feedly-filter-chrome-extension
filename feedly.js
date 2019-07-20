/**
 * Abstraction over the Feedly UI.
 */
function Feedly() {
  this.lastUrl = null;

  waitUntil(this.getMainContainer.bind(this), function(mainContainer) {
	  // Use the loading message to detect a change of the selected feed.
    mainContainer.addEventListener('DOMSubtreeModified', function() {
      if (!this.getLoadingMessage() && location.href != this.lastUrl) {
        this.lastUrl = location.href;
        this.onFeedChanged();
      }
    }.bind(this));
  }.bind(this), 'getMainContainer', 10000);
}
Feedly.prototype = new EventTargetImpl();


Feedly.EventType = {
  FEED_CHANGED: 'feed-changed',
  FEED_ITEMS_LOADED: 'feed-items-loaded'
};


Feedly.prototype.getMainContainer = function() {
  return document.getElementById('feedlyPageFX');
};


Feedly.prototype.getLoadingMessage = function() {
  return document.querySelector('#feedlyPageFX .loading');
};


Feedly.prototype.getTitleBar = function() {
  return document.getElementById('feedlyTitleBar');
};


Feedly.prototype.getItemContainer = function() {
  return document.querySelector('.list-entries');
};


Feedly.prototype.getItemRows = function() {
  return Array.prototype.slice.call(
      document.querySelectorAll('.list-entries .entry'));
};


Feedly.prototype.getPopularityForRow = function(row) {
  var engagementSpan = row.querySelector('span.EntryEngagement');
  return engagementSpan &&
      parseEngagementCountString(engagementSpan.textContent) || 0;
};


Feedly.prototype.getPopularities = function() {
  var popularities = this.getItemRows().map(this.getPopularityForRow);
  if (popularities.length > 1 && popularities.filter(x => x != 0).length == 0) {
    log('Warning: No popularities found. Possibly the DOM query is wrong.');
  }
  return popularities;
};


Feedly.prototype.isFeedFullyLoaded = function() {
  var container = this.getItemContainer();
  return container && !!container.querySelector('h4');
};


Feedly.prototype.doesContainerHaveEnoughItems = function() {
  var container = this.getItemContainer();
  return container &&
      container.getBoundingClientRect().bottom > window.innerHeight;
};


Feedly.prototype.shouldLoadMoreItems = function() {
  return !this.doesContainerHaveEnoughItems() && !this.isFeedFullyLoaded();
};


Feedly.prototype.loadMoreItems = function() {
  log('Trying to load more...');
  document.documentElement.scrollTop = 0;
  document.documentElement.scrollTop = 1000000;
};


Feedly.prototype.onFeedChanged = function() {
  // Notify listeners.
  log('Feed changed.');
  this.dispatchEvent(new Event(Feedly.EventType.FEED_CHANGED));
  // Wait until the items are loaded.
  waitUntil(this.getItemContainer.bind(this), function(itemContainer) {
	  log('Feed items loaded.');
    this.dispatchEvent(new Event(Feedly.EventType.FEED_ITEMS_LOADED));
    // Listen for more items to be loaded.
    // The DOMSubtreeModified is fired many times, so we throttle the callback.
    var throttle = new Throttle();
    itemContainer.addEventListener('DOMSubtreeModified', function() {
      throttle.fire(function() {
			  log('Feed items loaded');
        this.dispatchEvent(new Event(Feedly.EventType.FEED_ITEMS_LOADED));
      }.bind(this));
    }.bind(this));
  }.bind(this), 'getItemContainer', 5000);
};


Feedly.prototype.filterRows = function(threshold) {
  this.getItemRows().forEach(function(row) {
    var popularity = this.getPopularityForRow(row);
    row.style.display = popularity >= threshold ? '' : 'none';
  }, this);
};
