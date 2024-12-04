export type PropertyKey = string | number | symbol;

export type AnyObject<T extends PropertyKey = PropertyKey> = Record<T, any>;

export type SelectValue = string | number | undefined;

export interface SelectProps<T extends AnyObject = AnyObject, V extends SelectValue = SelectValue> {
  options: T[];
  labelKey?: string;
  valueKey?: string;
  value?: V;
  onChange?: (value: V, item: T, index: number) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  placeholder?: string;
}

export interface SelectInstance<T extends AnyObject = AnyObject, V extends SelectValue = SelectValue> extends HTMLDivElement {
  getValue: () => V;
  destroy: () => void;
}
