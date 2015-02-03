/**
 * Abstraction over the Feedly UI.
 */
function Feedly() {
  this.lastTitle = '';

  waitUntil(this.getTitleBar.bind(this), function(titleBar) {
    titleBar.addEventListener('DOMSubtreeModified', function() {
      var titleElement = this.getFeedTitle();
      if (titleElement && titleElement.innerText != this.lastTitle) {
        this.lastTitle = titleElement.innerText;
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


Feedly.prototype.getFeedTitle = function() {
  return document.querySelector('#feedlyTitleBar .feedTitle');
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
  return this.getItemRows().
      map(this.getPopularityForRow).
      sort(compareNumerically);
};


Feedly.prototype.onFeedChanged = function() {
  // Notify listeners.
  this.dispatchEvent(new Event(Feedly.EventType.FEED_CHANGED));
  // Wait until the items are loaded.
  waitUntil(this.getItemContainer.bind(this), function(itemContainer) {
    // TODO: Update when more items loaded. DOMSubtreeModified.
    this.dispatchEvent(new Event(Feedly.EventType.FEED_ITEMS_LOADED));
  }.bind(this));
};


Feedly.prototype.filterRows = function(threshold) {
  this.getItemRows().forEach(function(row) {
    var popularity = this.getPopularityForRow(row);
    row.style.display = popularity >= threshold ? '' : 'none';
  }, this);
};
