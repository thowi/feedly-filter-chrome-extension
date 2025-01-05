/**
 * Abstraction over the Feedly UI.
 */
class Feedly extends EventTargetImpl {
  static EventType = {
    FEED_CHANGED: 'feed-changed',
    FEED_ITEMS_LOADED: 'feed-items-loaded'
  };

  constructor() {
    super();
    this.lastUrl = null;

    waitUntil(this.getMainContainer.bind(this), function(mainContainer) {
      // Use the loading message to detect a change of the selected feed.
      const observer = new MutationObserver(mutationList => {
        for (const mutation of mutationList) {
          if (!this.getLoadingMessage() && location.href != this.lastUrl) {
            this.lastUrl = location.href;
            this.onFeedChanged();
          }
        }
      });
      observer.observe(mainContainer, { childList: true, subtree: true });
    }.bind(this), 'getMainContainer', 10000);
  }

  getMainContainer() {
    return document.getElementById('feedlyPageFX');
  }

  getLoadingMessage() {
    return document.querySelector('#feedlyPageFX .loading');
  }

  getTitleBar() {
    return document.getElementById('feedlyTitleBar');
  }

  getItemContainer() {
    return document.querySelector('.list-entries');
  }

  getItemRows() {
    return Array.prototype.slice.call(
      document.querySelectorAll('.list-entries .entry')
    );
  }

  getPopularityForRow(row) {
    var engagementSpan = row.querySelector('span.EntryEngagement');
    return engagementSpan &&
      parseEngagementCountString(engagementSpan.textContent) || 0;
  }

  getPopularities() {
    var popularities = this.getItemRows().map(this.getPopularityForRow);
    if (popularities.length > 1 && popularities.filter(x => x != 0).length == 0) {
      log('Warning: No popularities found. Possibly the DOM query is wrong.');
    }
    return popularities;
  }

  isFeedFullyLoaded() {
    var container = this.getItemContainer();
    return container && !!container.querySelector('h4');
  }

  doesContainerHaveEnoughItems() {
    var container = this.getItemContainer();
    return container &&
      container.getBoundingClientRect().bottom > window.innerHeight;
  }

  shouldLoadMoreItems() {
    return !this.doesContainerHaveEnoughItems() && !this.isFeedFullyLoaded();
  }

  loadMoreItems() {
    log('Trying to load more...');
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollTop = 1000000;
  }

  onFeedChanged() {
    // Notify listeners.
    log('Feed changed.');
    this.dispatchEvent(new Event(Feedly.EventType.FEED_CHANGED));
    // Wait until the items are loaded.
    waitUntil(this.getItemContainer.bind(this), function(itemContainer) {
      log('Feed items loaded.');
      this.dispatchEvent(new Event(Feedly.EventType.FEED_ITEMS_LOADED));
      // Listen for more items to be loaded.
      // The MutationObserver is fired many times, so we throttle the callback.
      var throttle = new Throttle();
      const observer = new MutationObserver(function() {
        throttle.fire(function() {
          log('Feed items loaded');
          this.dispatchEvent(new Event(Feedly.EventType.FEED_ITEMS_LOADED));
        }.bind(this));
      }.bind(this));
      observer.observe(itemContainer, { childList: true, subtree: true });
    }.bind(this), 'getItemContainer', 5000);
  }

  filterRows(threshold) {
    this.getItemRows().forEach(function(row) {
      var popularity = this.getPopularityForRow(row);
      row.style.display = popularity >= threshold ? '' : 'none';
    }, this);
  }
}
