import { useBoolean, useSafeState } from "ahooks";
import { useCallback, useRef, type ChangeEvent } from "react";

const Search = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useSafeState('');
  const [composition, setComposition] = useBoolean(false);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <>
      <form className="" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="bg-transparent flex-1 py-2 pr-5 pl-3 text-sm outline-none"
          placeholder="请输入你要翻译的内容"
          onInput={handleInput}
          onCompositionStart={setComposition.setTrue}
          onCompositionEnd={setComposition.setFalse}
        />
      </form>
    </>
  );
};
