class EventEmitter {
  private events: Map<string, Function[]>;
  constructor() {
    this.events = new Map();
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
  }

  public on(event: string, callback: Function) {
    const callbacks = this.events.get(event) || [];
    callbacks.push(callback);
    this.events.set(event, callbacks);
  }

  public off(event: string, callback?: Function) {
    if (!callback) {
      this.events.delete(event);
      return;
    }
    const callbacks = this.events.get(event) || [];
    this.events.set(event, callbacks.filter(cb => cb !== callback));
  }

  public emit(event: string, ...args: any[]) {
    const callbacks = this.events.get(event) || [];
    callbacks.forEach(cb => cb(...args));
  }
}

export default EventEmitter;
