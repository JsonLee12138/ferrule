import type { AnyObject } from 'jsonlee-utils/dist/types/global';
import type { SelectProps, SelectValue } from './type';
import './style.scss';
import {
  useCallback,
  type ChangeEventHandler,
  useMemo,
  useRef,
  ReactNode,
  useEffect,
  useLayoutEffect,
} from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { useDebounceFn, useSafeState } from 'ahooks';

const Select = <
  T extends AnyObject = AnyObject,
  V extends SelectValue = SelectValue,
>({
  options,
  labelKey = 'label',
  valueKey = 'value',
  searchable = false,
  searchPlaceholder = '请输入搜索内容',
  value,
  placeholder = '请选择',
  onChange,
  icon: Icon,
  className,
}: Omit<SelectProps<T, V>, 'icon'> & {
  icon?: ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [keywords, setKeywords] = useSafeState<string>('');
  const opts = useMemo(() => {
    if (keywords) {
      return options.filter((option) =>
        (option[labelKey] as string)
          .toLocaleLowerCase()
          .includes(keywords.toLocaleLowerCase()),
      );
    }
    return options;
  }, [keywords, labelKey, options]);
  const current = useMemo<T | undefined>(() => {
    const item = options.find((option) => option[valueKey] === value);
    return item;
  }, [options, value, valueKey]);

  const { run: handleSearchChange } = useDebounceFn(
    useCallback<ChangeEventHandler<HTMLInputElement>>(
      (e) => {
        setKeywords(e.target.value);
      },
      [setKeywords],
    ),
    { wait: 300 },
  );

  const handleChange = useCallback(
    (item: T, index: number) => {
      const _value = item[valueKey];
      onChange?.(_value, item, index);
      containerRef.current?.blur();
    },
    [onChange, valueKey],
  );

  useEffect(() => {
    document.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if(popoverRef.current){
          const popoverStyle = getComputedStyle(popoverRef.current);
          if(popoverStyle.visibility === 'visible'){
            e.stopPropagation();
            containerRef.current?.blur();
          }
        }
      }
    });
    return () => {
      document.removeEventListener('keydown', (_e: KeyboardEvent) => {});
    };
  }, []);

  useLayoutEffect(() => {
    if (
      popoverRef.current &&
      (!popoverRef.current.dataset.ver || !popoverRef.current.dataset.hor)
    ) {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const rect = popoverRef.current.getBoundingClientRect();
      if (rect.right >= windowWidth) {
        popoverRef.current.dataset.ver = 'left';
      } else {
        popoverRef.current.dataset.ver = 'right';
      }
      if (rect.bottom >= windowHeight) {
        popoverRef.current.dataset.hor = 'top';
      } else {
        popoverRef.current.dataset.hor = 'bottom';
      }
    }
  }, []);

  return (
    <div
      className={`j-select-container ${className}`}
      tabIndex={0}
      ref={containerRef}
    >
      <div className={'j-select-content'} data-set={{ empty: !value }}>
        {value ? (
          <span data-set={{ placeholder: true }}>{current![labelKey]}</span>
        ) : (
          <span>{placeholder}</span>
        )}
      </div>
      {Icon || <IoChevronDown />}
      <div className={'j-select-popover'} ref={popoverRef}>
        {searchable && (
          <input
            placeholder={searchPlaceholder}
            onChange={handleSearchChange}
          />
        )}
        <ul>
          {opts.map((item, i) => {
            const _value = item[valueKey];
            const _label = item[labelKey];
            return (
              <li
                data-set={{ checked: value === _value }}
                key={_value}
                value={_value}
                onClick={() => handleChange(item, i)}
              >
                {_label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default Select;
