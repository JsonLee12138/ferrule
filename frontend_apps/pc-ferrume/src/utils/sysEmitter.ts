import EventEmitter from "./emitter";

export enum SystemEvent {
  ESC = 'esc',
}

export const systemEmitter = new EventEmitter();
