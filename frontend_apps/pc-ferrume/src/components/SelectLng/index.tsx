import Select from '@/components/Select';
import type { SelectProps } from '@/components/Select/type';
import type { LngItem } from './type';
import { lngOptions } from './data';
import { useCallback } from 'react';

interface SelectLngOptions
  extends Omit<
    SelectProps,
    'labelKey' | 'valueKey' | 'options' | 'onChange' | 'value'
  > {
  onChange?: (val: string) => void;
  value?: string;
}

const SelectLng = ({ onChange, value, ...props }: SelectLngOptions) => {
  const handleChange = useCallback(
    (e: string) => {
      onChange?.(e);
    },
    [onChange],
  );
  return (
    <Select<LngItem, string>
      {...props}
      value={value}
      searchable={true}
      options={lngOptions}
      labelKey="name"
      valueKey="language"
      onChange={handleChange}
    />
  );
};

export default SelectLng;
