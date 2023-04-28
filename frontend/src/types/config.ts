export interface HotKeyText {
  keys: string;
  text: string;
}

export interface HotKeysMap {
  simpleShortCuts: HotKeyText[];
  layout: HotKeyText[];
  editor: HotKeyText[];
}
