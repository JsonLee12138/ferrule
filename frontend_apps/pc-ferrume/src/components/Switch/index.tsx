import { Switch as MSwitch, SwitchProps as MSwitchProps } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { SwitchProps } from './types';

const Switch = <T = boolean,>({ value = false as T, checkedValue = true as T, uncheckedValue = false as T, onChange, ...props }: SwitchProps<T>) => {
  // state
  const checked = useMemo(() => value === checkedValue, [value, checkedValue]);

  // function
  const handleChange = useCallback(() => {
    onChange?.(checked ? uncheckedValue : checkedValue);
  }, [checked]);
  // useEffect
  return <MSwitch {...props as MSwitchProps} onChange={handleChange} checked={checked} />;
};

export default Switch;