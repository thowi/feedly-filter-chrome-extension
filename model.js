/** The model. */
class Model extends EventTarget {
  static EventType = {
    POPULARITY_FILTER_CHANGED: 'popularity-filter-changed'
  };

  constructor() {
    super();

    /** The popularity filter level in the range [0, 1]. */
    this.popularityFilter_ = 0;
  }

  /** Sets the popularity filter level in the range [0, 1]. */
  setPopularityFilter(value) {
    if (this.popularityFilter_ == value) {
      return;
    }
    this.popularityFilter_ = value;
    this.dispatchEvent(new Event(Model.EventType.POPULARITY_FILTER_CHANGED));
  }

  /** Returns the popularity filter level in the range [0, 1]. */
  getPopularityFilter() {
    return this.popularityFilter_;
  }
}
