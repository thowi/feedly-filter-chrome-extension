/**
 * Abstraction over the Feedly UI.
 */
function Feedly() {
}


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


Feedly.prototype.filterRows = function(threshold) {
  this.getItemRows().forEach(function(row) {
    var popularity = this.getPopularityForRow(row);
    row.style.display = popularity >= threshold ? '' : 'none';
  }, this);
};
