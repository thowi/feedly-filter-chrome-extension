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




function injectUi(element, actionBar) {
  actionBar.insertBefore(element, actionBar.firstChild);
}


function init() {
  var feedly = new Feedly();
  var filter = new Filter(feedly);
  waitUntil(feedly.getFeedTitle, function(titleBar) {
    var actionBar = feedly.getActionBar();
    injectUi(filter.element, actionBar);

    var titleBar = feedly.getTitleBar();
    // TODO: Add a check that the title actually changed. The event gets fired twice.
    // TODO: Update when more items loaded. DOMSubtreeModified.
    titleBar.addEventListener('DOMSubtreeModified', function() {
      var titleElement = feedly.getFeedTitle();
      if (titleElement) {
        console.log(titleElement.innerText);
        waitUntil(feedly.getItemContainer, function(itemContainer) {
          console.log(itemContainer.children.length);
          var popularities = feedly.getPopularities();
          filter.setRange(
              popularities[0] /* min */,
              popularities[popularities.length - 1] /* max */);
        })
      }
    });
  });

}


init();
