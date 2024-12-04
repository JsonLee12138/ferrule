import React, { useCallback, useMemo, type FormEventHandler } from 'react';
import styles from './style.module.scss';
import { useSafeState } from 'ahooks';

interface Props {
  className?: HTMLDivElement['className'];
  placeholder?: string;
  onChange?: (val: string) => void;
  value?: string;
}

function JsonInput({
  className,
  placeholder,
  onChange,
  value: defaultValue,
}: Props) {
  const [value, setValue] = useSafeState<string>(defaultValue || '');
  const showPlaceholder = useMemo<boolean>(() => !value, [value]);
  const handleInput = useCallback<FormEventHandler<HTMLElement>>((e) => {
    const el = e.target as HTMLDivElement;
    const val = el.textContent || '';
    setValue(val);
    onChange?.(val);
  }, []);
  return (
    <div
      className={`${showPlaceholder && styles['json-placeholder']} relative outline-none ${className}`}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
      tabIndex={0}
      contentEditable
      onInput={handleInput}
      data-placeholder={placeholder}
    />
  );
}

export default JsonInput;
