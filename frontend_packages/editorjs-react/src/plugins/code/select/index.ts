import chevronDownIcon from '../assets/chevronDownIcon';
import EventEmitter from '../../../utils/emitter';
import { stringToElement } from '../../../utils/stringToElment';
import './style.scss';
import type { AnyObject, SelectValue, SelectProps, SelectInstance } from './type';

const emitter = new EventEmitter();

const renderOptions = <T extends AnyObject = AnyObject, V extends SelectValue = SelectValue>({ options, labelKey = 'label', valueKey = 'value', onChange, value, wrapper }: Pick<SelectProps<T, V>, 'options' | 'labelKey' | 'valueKey' | 'onChange' | 'value'> & { wrapper: HTMLUListElement }) => {
  wrapper.innerHTML = '';
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const optionItem = document.createElement('li');
    optionItem.textContent = option[labelKey] as string;
    optionItem.dataset.value = option[valueKey] as string;
    if (option[valueKey] === value) {
      optionItem.dataset.checked = 'true';
    }
    optionItem.addEventListener('click', (e) => {
      e.stopPropagation();
      onChange?.(option[valueKey] as V, option, i);
    })
    wrapper.appendChild(optionItem);
  }
  return wrapper;
}
const renderContent = ({ placeholder = '请选择', element }: { placeholder: string, element: HTMLDivElement }, value?: string) => {
  element.innerHTML = '';
  if (!value) {
    element.dataset.empty = 'true';
    const placeholderElement = document.createElement('span');
    placeholderElement.dataset.placeholder = placeholder;
    element.appendChild(placeholderElement);
    return;
  }
  const valueElement = document.createElement('span');
  valueElement.dataset.empty = 'false';
  valueElement.textContent = value;
  element.appendChild(valueElement);
}
const hidden = (el: HTMLElement) => {
  el.style.visibility = 'hidden';
}
const show = (el: HTMLElement) => {
  el.style.visibility = 'visible';
}
const findOption = <T extends AnyObject = AnyObject, V extends SelectValue = SelectValue>(options: T[], value?: V, valueKey = 'value'): T | undefined => {
  return options.find(option => option[valueKey] === value);
}
const selectSetup = <T extends AnyObject = AnyObject, V extends SelectValue = SelectValue>({ options, labelKey = 'label', valueKey = 'value', searchable = false, searchPlaceholder = '请输入搜索内容', value, placeholder = '请选择', onChange }: SelectProps<T, V>): SelectInstance => {
  const state = new Proxy({
    keyword: '',
    options: options,
    modelValue: value,
    current: findOption<T, V>(options, value, valueKey)
  }, {
    set(target, key, value) {
      switch (key) {
        case 'keyword':
          if (value) {
            target.options = options.filter(option => (option[labelKey] as string).toLocaleLowerCase().includes((value).toLocaleLowerCase()));
          } else {
            target.options = options;
          }
          emitter.emit('update:options', target.options);
          break;
        case 'current':
          emitter.emit('update:current', value);
          target.current = value;
          break;
        default:
          target[key as keyof typeof target] = value;
          break;
      }
      return true;
    },
    get(target, key) {
      const _key = key as keyof typeof target;
      if (key === 'options') {
        if (!target.keyword) {
          return target.options;
        }
        return target.options.filter(option => (option[labelKey] as string).toLocaleLowerCase().includes((target.keyword).toLocaleLowerCase()));
      }
      return target[_key];
    }
  })
  const select = document.createElement('div') as SelectInstance;
  select.tabIndex = 0;
  select.className = 'j-select-container';
  const content = document.createElement('div');
  content.className = 'j-select-content';
  renderContent({ element: content, placeholder }, state.current?.[labelKey] as string);
  emitter.on('update:current', (_current: T) => {
    requestAnimationFrame(() => {
      renderContent({ element: content, placeholder }, _current?.[labelKey] as string);
    })
  })
  select.appendChild(content);
  const icon = stringToElement(chevronDownIcon);
  select.appendChild(icon);
  select.addEventListener('click', (e) => {
    e.stopPropagation();
    // if (!(e.target as HTMLElement).closest('.j-select-popover')) {
    // }
  })
  select.addEventListener('focus', () => {
    show(popover);
  })
  let rafId: number | null = null;
  select.addEventListener('blur', (e) => {
    rafId = requestAnimationFrame(() => {
      if ((e.relatedTarget as HTMLElement)?.closest('.j-select-popover')) {
        if ((e.relatedTarget as HTMLElement).tagName === 'INPUT') {
          (e.relatedTarget as HTMLInputElement).focus();
          return;
        }
        select.focus();
        return;
      }
      hidden(popover);
    })
  })
  select.addEventListener('focusin', () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      select.blur();
    }
  })
  const popover = document.createElement('div');
  popover.className = 'j-select-popover';
  let input: HTMLInputElement | undefined;
  if (searchable) {
    input = document.createElement('input');
    input.type = 'text';
    input.placeholder = searchPlaceholder;
    input.addEventListener('input', (e) => {
      state.keyword = (e.target as HTMLInputElement).value;
    })
    popover.appendChild(input);
  }
  popover.addEventListener('click', (e) => {
    e.stopPropagation();
  })
  const optionContainer = document.createElement('ul');
  const handleChange = (value: V, item: T, index: number) => {
    renderOptions({
      options: state.options, labelKey, valueKey, wrapper: optionContainer, value, onChange: handleChange
    });
    state.modelValue = value;
    state.current = item;
    state.keyword = '';
    input && (input.value = '');
    select.blur();
    onChange?.(value, item, index);
  }
  renderOptions({
    options: state.options, labelKey, valueKey, wrapper: optionContainer, onChange: handleChange, value: state.modelValue
  });
  emitter.on('update:options', (opts: T[]) => {
    renderOptions({ options: opts, labelKey, valueKey, wrapper: optionContainer, onChange: handleChange, value: state.modelValue });
  })
  popover.appendChild(optionContainer);
  select.appendChild(popover);
  select.getValue = () => state.modelValue;
  select.destroy = () => {
    emitter.off('update:options');
    emitter.off('update:current');
    hidden(popover);
    select.remove();
    document.removeEventListener('keydown', () => { })
  }
  return select;
}

export default selectSetup;
