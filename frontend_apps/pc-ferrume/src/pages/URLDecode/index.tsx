import { useEffect, useLayoutEffect, useRef } from 'react';
import qs from 'qs';
import ace from 'brace';
import 'brace/mode/json';
import { systemEmitter, SystemEvent } from '@/utils/sysEmitter';
import { invoke } from '@tauri-apps/api/core';

interface URLShowType {
  host: string;
  port: string;
  pathname: string;
  fullPath: string;
  encodedFullPath: string;
  origin: string;
  protocol: string;
  hostname: string;
  params: Record<string, string>;
}

const URLDecode = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const jsonViewRef = useRef<HTMLDivElement>(null);
  const jsonViewInstance = useRef<ace.Editor | null>(null);

  const handleDecode = () => {
    if (!inputRef.current || !inputRef.current.value) return;
    const url = new URL(inputRef.current.value);
    const _result: URLShowType = {
      host: url.host,
      port: url.port,
      pathname: url.pathname,
      fullPath: url.href,
      encodedFullPath: decodeURIComponent(url.href),
      origin: url.origin,
      protocol: url.protocol,
      hostname: url.hostname,
      params: qs.parse(url.search.slice(1)) as Record<string, string>,
    };
    jsonViewInstance.current?.setValue(JSON.stringify(_result, null, 2));
  };

  useLayoutEffect(() => {
    if (jsonViewRef.current) {
      jsonViewInstance.current = ace.edit(jsonViewRef.current);
      jsonViewInstance.current.setTheme('ace/theme/github');
      jsonViewInstance.current.getSession().setMode('ace/mode/json');
      jsonViewInstance.current.setReadOnly(true);
      jsonViewInstance.current.setShowPrintMargin(false);
      jsonViewInstance.current.$blockScrolling = Infinity;
    }
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
    systemEmitter.on(SystemEvent.ESC, () => {
      invoke('close_window', { id: 'url_decode' });
    });
    return () => {
      systemEmitter.off(SystemEvent.ESC);
    };
  }, []);

  return (
    <div className="w-screen h-screen max-w-[1024px] mx-auto p-2 flex flex-col">
      <textarea
        ref={inputRef}
        className="w-full rounded-md focus:outline-none focus:border-indigo-500 px-1.5 py-1 border-[3px] border-transparent shadow"
        rows={5}
      />
      <button
        className="bg-indigo-500 text-white px-4 py-2 rounded-md mt-2"
        onClick={handleDecode}
      >
        解析
      </button>
      <div className="flex-1 mt-2 flex shadow rounded overflow-hidden">
        <div ref={jsonViewRef} className="flex-1"></div>
      </div>
    </div>
  );
};

export default URLDecode;
