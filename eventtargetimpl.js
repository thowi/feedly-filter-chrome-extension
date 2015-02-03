/**
 * A very incomplete EventTarget implementation.
 */
function EventTargetImpl() {
  this.listeners = {};
}


EventTargetImpl.prototype.addEventListener = function(type, listener) {
  if (!this.listeners[type]) {
    this.listeners[type] = [];
  }
  this.listeners[type].push(listener);
};


EventTargetImpl.prototype.dispatchEvent = function(event) {
  if (this.listeners[event.type]) {
    this.listeners[event.type].forEach(function(listener) {
      listener(event);
    }, this);
  }
};
