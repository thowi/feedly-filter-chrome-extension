// TODO: Use popularity histogram as the values are not distributed linearly.
// TODO: Re-filter when more rows are loaded.
// TODO: When switching feeds automatically load all entries.

function Filter() {
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
  this.range.addEventListener('change', this.filterRows.bind(this));
};


Filter.prototype.filterRows = function() {
  var threshold = this.range.value;
  getItemRows().forEach(function(row) {
    var popularity = getPopularityForRow(row);
    row.style.display = popularity >= threshold ? '' : 'none';
  });
};



function waitUntil(closure, callback) {
  var result = closure();
  if (result) {
    callback(result);
  } else {
    setTimeout(waitUntil.bind(null /* this */, closure, callback), 100);
  }
}


function getActionBar() {
  return document.querySelector('.pageActionBar');
}


function getTitleBar() {
  return document.getElementById('feedlyTitleBar');
}


function getFeedTitle() {
  return document.querySelector('#feedlyTitleBar .feedTitle');
}


function getItemContainer() {
  return document.getElementById('section0_column0');
}


function getItemRows() {
  return Array.prototype.slice.call(getItemContainer().children);
}


function getPopularityForRow(row) {
  var popularityElement = row.querySelector('.recommendationInfo span');
  return parseInt(popularityElement.getAttribute('data-engagement'));
}


function getPopularities() {
  return getItemRows().map(getPopularityForRow).sort(compareNumerically);
}


function compareNumerically(a, b) {
  return a - b;
}


function injectUi(element, actionBar) {
  actionBar.insertBefore(element, actionBar.firstChild);
}


function onFeedChanged() {

}


function onContentLoaded() {

}



function init() {
  var filter = new Filter();
  waitUntil(getFeedTitle, function(titleBar) {
    var actionBar = getActionBar();
    injectUi(filter.element, actionBar);

    var titleBar = getTitleBar();
    // TODO: Add a check that the title actually changed. The event gets fired twice.
    // TODO: Update when more items loaded. DOMSubtreeModified.
    titleBar.addEventListener('DOMSubtreeModified', function() {
      var titleElement = getFeedTitle();
      if (titleElement) {
        console.log(titleElement.innerText);
        waitUntil(getItemContainer, function(itemContainer) {
          console.log(itemContainer.children.length);
          var popularities = getPopularities();
          filter.setRange(
              popularities[0] /* min */,
              popularities[popularities.length - 1] /* max */);
        })
      }
    });
  });

}


init();
