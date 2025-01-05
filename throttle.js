class Throttle {
  constructor() {
    this.running = false;
  }
  
  fire(func) {
    if (!this.running) {
      this.running = true;
      setTimeout(function() {
        func();
        this.running = false;
      }.bind(this), 0);
    }
  }
}
