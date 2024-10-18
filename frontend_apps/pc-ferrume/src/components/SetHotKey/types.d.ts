export interface SetHotKeyProps extends Partial<Pick<HTMLInputElement, 'className'>> {
  value: string;
  onChange: (keys: string[], hotKey: string)=> void;
}
