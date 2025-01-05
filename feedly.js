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

    // Wait until the main container is loaded and a new URL is detected.
    waitUntil(() => this.getMainContainer(), (mainContainer) => {
      const observer = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
          if (!this.getLoadingMessage() && location.href != this.lastUrl) {
            this.lastUrl = location.href;
            this.onFeedChanged();
          }
        }
      });
      observer.observe(mainContainer, { childList: true, subtree: true });
    }, 'getMainContainer', 10000);
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
    return document.querySelector('main .StreamPage');
  }

  getItemRows() {
    return Array.from(document.querySelectorAll('main .StreamPage article'));
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
    return container && (
      !!findElementWithText(container.querySelector('h2'), 'All done!')
      || !!findElementWithText(container.querySelector('h2'), 'End of feed'));
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

    // Wait until the container and items are loaded.
    waitUntil(() => this.getItemContainer(), (itemContainer) => {
      log('Feed item container loaded.');
      this.dispatchEvent(new Event(Feedly.EventType.FEED_ITEMS_LOADED));

      // Listen for more items to be loaded inside the container.
      // The MutationObserver is fired many times, so we throttle the callback.
      var throttle = new Throttle();
      const observer = new MutationObserver(mutationList => {
        for (const mutation of mutationList) {
          if (Array.from(mutation.addedNodes).find(e => e.nodeName == 'ARTICLE')) {
            // New articles added.
            throttle.fire(() => {
              log('More feed items loaded');
              this.dispatchEvent(new Event(Feedly.EventType.FEED_ITEMS_LOADED));
            });
          }
        }
      });
      observer.observe(itemContainer, { childList: true, subtree: true });
    }, 'getItemContainer', 5000);
  }

  filterRows(threshold) {
    for (row of this.getItemRows()) {
      var popularity = this.getPopularityForRow(row);
      row.style.display = popularity >= threshold ? '' : 'none';
    }
  }
}
