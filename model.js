/** The model. */
function Model() {
  /** The popularity filter level in the range [0, 1]. */
  this.popularityFilter_ = 0;
}
Model.prototype = new EventTargetImpl();


Model.EventType = {
  POPULARITY_FILTER_CHANGED: 'popularity-filter-changed'
};


/** Sets the popularity filter level in the range [0, 1]. */
Model.prototype.setPopularityFilter = function(value) {
  if (this.popularityFilter_ == value) {
    return;
  }
  this.popularityFilter_ = value;
  this.dispatchEvent(new Event(Model.EventType.POPULARITY_FILTER_CHANGED));
}


/** Returns the popularity filter level in the range [0, 1]. */
Model.prototype.getPopularityFilter = function() {
  return this.popularityFilter_;
}
