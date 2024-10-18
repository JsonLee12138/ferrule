import type { FunctionType } from "@/types";

class EventEmitter {
  private events: Map<string, FunctionType[]>;
  constructor() {
    this.events = new Map();
    this.on = this.on.bind(this);
    this.off = this.off.bind(this);
    this.emit = this.emit.bind(this);
  }

  public on(event: string, callback: FunctionType) {
    const callbacks = this.events.get(event) || [];
    callbacks.push(callback);
    this.events.set(event, callbacks);
  }

  public off(event: string, callback?: FunctionType) {
    if (!callback) {
      this.events.delete(event);
      return;
    }
    const callbacks = this.events.get(event) || [];
    this.events.set(event, callbacks.filter(cb => cb !== callback));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public emit(event: string, ...args: any[]) {
    const callbacks = this.events.get(event) || [];
    callbacks.forEach(cb => cb(...args));
  }
}

export default EventEmitter;
