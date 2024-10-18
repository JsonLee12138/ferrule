export type PropertyKey = string | number | symbol;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject<T extends PropertyKey = PropertyKey> = Record<T, any>;

export type SelectValue = string | number | undefined;

export interface SelectProps<T extends AnyObject = AnyObject, V extends SelectValue = SelectValue> extends Partial<Pick<HTMLDivElement, 'className'>>{
  options: T[];
  labelKey?: string;
  valueKey?: string;
  value?: V;
  onChange?: (value: V, item: T, index: number) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  placeholder?: string;
  icon?: string;
}

export interface SelectInstance<V extends SelectValue = SelectValue> extends HTMLDivElement {
  getValue: () => V;
  destroy: () => void;
}
