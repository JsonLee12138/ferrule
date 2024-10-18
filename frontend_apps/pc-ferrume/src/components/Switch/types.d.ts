import { SelectProps as MSelectProps } from '@mui/material'

export interface SwitchProps<T = boolean> extends Omit<MSelectProps, 'checked' | 'value' | 'onChange'> {
  value?: T;
  checkedValue?: T;
  uncheckedValue?: T;
  onChange?: (value: T) => void;
}