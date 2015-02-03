function Throttle() {
  this.running = false;
}


Throttle.prototype.fire = function(func) {
  if (!this.running) {
    this.running = true;
    setTimeout(function() {
      func();
      this.running = false;
    }.bind(this), 0);
  }
};
