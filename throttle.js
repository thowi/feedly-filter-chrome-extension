class Throttle {
  constructor() {
    this.running = false;
  }
  
  fire(func) {
    if (!this.running) {
      this.running = true;
      setTimeout(() => {
        func();
        this.running = false;
      }, 0);
    }
  }
}
