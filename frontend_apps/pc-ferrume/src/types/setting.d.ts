import type { SetterOrUpdater } from "recoil";
export interface ShortcutItem {
  enabled: boolean;
  hotkey: string;
}

export interface Translate {
  shortcut: ShortcutItem;
  systemLanguage: string;
  targetLanguage: string;
}

export interface System {
  startAtLogin: boolean;
  showDockIcon: boolean;
  showTrayIcon: boolean;
  silentStart: boolean;
}

export interface JsonEditor {
  openShortcut: ShortcutItem;
  theme: string;
  tabSize: number;
  formatShortcut: string;
}

export interface Setting {
  translate: Translate;
  system: System;
  jsonEditor: JsonEditor;
}


export interface SettingStoreHandler {
  refresh: () => Promise<void>,
  set: SetterOrUpdater<Setting>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItem: <T = any>(key: string, value: T, onlyLocal?: boolean) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItem: <T = any>(key: string, defaultValue?: T) => T
}
