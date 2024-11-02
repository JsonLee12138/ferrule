import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
} from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useBoolean, useSafeState } from 'ahooks';
import type { TranslateResponse } from '@/types/translate';
import Loading from '@/components/Loading';
import { CopyState } from '@/enum/copy';
import styles from './style.module.scss';
import { systemEmitter, SystemEvent } from '@/utils/sysEmitter';
import { IconButton, Snackbar } from '@mui/material';
import { MdOutlineClose } from 'react-icons/md';

function Translate() {
  const [value, setValue] = useSafeState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const compositionRef = useRef(false);
  const [composition, setComposition] = useBoolean(false);
  const [result, setResult] = useSafeState('');
  const [loading, setLoading] = useBoolean(false);
  const [copyState, setCopyState] = useSafeState(CopyState.UNCOPY);
  const [messageVisible, setMessageVisible] = useBoolean();

  const copyStateText = useMemo(() => {
    switch (copyState) {
      case CopyState.UNCOPY:
        return '点击文本复制';
      case CopyState.COPY_SUCCESS:
        return '复制成功';
      case CopyState.COPY_FAILED:
        return '复制失败';
      default:
        return '点击文本复制';
    }
  }, [copyState]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (loading) {
        return;
      }
      if (value) {
        try {
          setLoading.setTrue();
          const res = await invoke<TranslateResponse>('translate', {
            text: [value],
          });
          setCopyState(CopyState.UNCOPY);
          setResult(res.translations[0].text);
        } catch (error) {
          console.log('error', error);
        } finally {
          setLoading.setFalse();
        }
      } else {
        setResult('');
      }
    },
    [value],
  );

  const handleInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await invoke('set_clipboard', { text: result });
      setCopyState(CopyState.COPY_SUCCESS);
      requestAnimationFrame(() => {
        setMessageVisible.setTrue();
      });
    } catch (error) {
      setCopyState(CopyState.COPY_FAILED);
      requestAnimationFrame(() => {
        setMessageVisible.setTrue();
      });
      console.log('error', error);
    }
  }, [result]);

  useEffect(() => {
    compositionRef.current = composition;
  }, [composition]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    systemEmitter.on(SystemEvent.ESC, () => {
      invoke('close_window', { id: 'translate' });
    });
    return () => {
      systemEmitter.off(SystemEvent.ESC);
    };
  }, []);

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="bg-transparent flex-1 py-2 pr-5 pl-3 text-sm outline-none"
          placeholder="请输入你要翻译的内容"
          onInput={handleInput}
          onCompositionStart={setComposition.setTrue}
          onCompositionEnd={setComposition.setFalse}
        />
        <button
          className="rounded py-2 px-4 text-sm hover:bg-indigo-500 hover:text-white active:bg-indigo-500 active:text-white disabled:bg-indigo-500 disabled:text-white m-[1px] mr-0"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <Loading size={18} color="#fff" /> : '翻译'}
        </button>
      </form>
      {result && (
        <div className="bg-white p-4 mt-3 rounded shadow">
          <p className="text-gray-500 text-sm">翻译结果: ({copyStateText})</p>
          <p className="mt-1 cursor-pointer" onClick={handleCopy}>
            {result}
          </p>
        </div>
      )}
      <Snackbar
        message={copyStateText}
        autoHideDuration={2000}
        open={messageVisible}
        onClose={setMessageVisible.setFalse}
        action={
          <IconButton onClick={setMessageVisible.setFalse}>
            <MdOutlineClose color="#fff" />
          </IconButton>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}

export default Translate;
