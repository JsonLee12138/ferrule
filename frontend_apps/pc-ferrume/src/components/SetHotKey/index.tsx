import { useCallback, useRef } from 'react';
import type { SetHotKeyProps } from './types.d.ts';
import { useSafeState } from 'ahooks';

const SetHotKey = ({value, onChange}: SetHotKeyProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [keys, setKeys] = useSafeState<string[]>([]);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let key = '';
    if (e.code.includes('Left') || e.code.includes('Right')) {
      key = e.code.replace('Left', '').replace('Right', '');
    } else if (e.code.includes('Key')) {
      key = e.code.replace('Key', '');
    }
    if (key === 'Meta') {
      key = 'CmdOrCtrl';
    }
    setKeys((prev) => [...prev, key]);
  }, []);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    requestAnimationFrame(() => {
      const key = keys.join('+');
      onChange(keys, key);
      inputRef.current?.blur();
    });
  }, [keys, onChange]);

  const handleFocus = useCallback(() => {
    setKeys([]);
  }, []);
  return (
    <>
      <input
        className="w-fit text-center pr-2 rounded-md py-1 focus:outline outline-indigo-500 bg-stone-100 text-[#333] text-sm/6 hover:shadow"
        ref={inputRef}
        type="text"
        value={value}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        readOnly
      />
    </>
  );
};

export default SetHotKey;
