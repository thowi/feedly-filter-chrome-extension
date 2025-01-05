/**
 * A very incomplete EventTarget implementation.
 */
class EventTargetImpl {
  constructor() {
    this.listeners = {};
  }

  addEventListener(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  dispatchEvent(event) {
    if (this.listeners[event.type]) {
      for (const listener of this.listeners[event.type]) {
        listener(event);
      }
    }
  }
}
