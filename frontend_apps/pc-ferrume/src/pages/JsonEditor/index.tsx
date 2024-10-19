import { useBoolean, useSafeState } from 'ahooks';
import ace from 'brace';
import 'brace/mode/json';
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  MdOutlineEditOff,
  MdOutlineEdit,
  MdDeleteOutline,
  MdOutlineFormatPaint,
} from 'react-icons/md';
import { IoMdCopy } from 'react-icons/io';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { invoke } from '@tauri-apps/api/core';
import { CopyState } from '@/enum/copy';
import { aceThemes } from '@/constant/aceTheme';
import { Tooltip } from '@mui/material';
import 'brace/theme/ambiance';
import 'brace/theme/chaos';
import 'brace/theme/chrome';
import 'brace/theme/clouds_midnight';
import 'brace/theme/clouds';
import 'brace/theme/cobalt';
import 'brace/theme/crimson_editor';
import 'brace/theme/dawn';
import 'brace/theme/dracula';
import 'brace/theme/dreamweaver';
import 'brace/theme/eclipse';
import 'brace/theme/github';
import 'brace/theme/gob';
import 'brace/theme/gruvbox';
import 'brace/theme/idle_fingers';
import 'brace/theme/iplastic';
import 'brace/theme/katzenmilch';
import 'brace/theme/kr_theme';
import 'brace/theme/kuroir';
import 'brace/theme/merbivore_soft';
import 'brace/theme/merbivore';
import 'brace/theme/mono_industrial';
import 'brace/theme/monokai';
import 'brace/theme/pastel_on_dark';
import 'brace/theme/solarized_dark';
import 'brace/theme/solarized_light';
import 'brace/theme/sqlserver';
import 'brace/theme/terminal';
import 'brace/theme/textmate';
import 'brace/theme/tomorrow_night_blue';
import 'brace/theme/tomorrow_night_bright';
import 'brace/theme/tomorrow_night_eighties';
import 'brace/theme/tomorrow_night';
import 'brace/theme/tomorrow';
import 'brace/theme/twilight';
import 'brace/theme/vibrant_ink';
import 'brace/theme/xcode';
import 'brace/snippets/json';
import { useSetting } from '@/store/setting';
import { objToJson } from '@/utils/obj';
import { systemEmitter, SystemEvent } from '@/utils/sysEmitter';
import { MdOutlineDriveFileMove } from "react-icons/md";

interface ComponentWithRefProps {
  children: React.ReactNode;
}

const ComponentWithRef = forwardRef<HTMLDivElement, ComponentWithRefProps>(
  ({ children, ...props }, ref) => {
    return (
      <div className='w-fit' {...props} ref={ref}>
        {children}
      </div>
    );
  },
);

ComponentWithRef.displayName = 'ComponentWithRef';

const isDarkColor = (color: string) => {
  let rgbArray: undefined | number[];
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    rgbArray = [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  } else if (color.startsWith('rgba')) {
    rgbArray = color.match(/\d+/g)?.slice(0, 3).map(Number);
  } else if (color.startsWith('rgb')) {
    rgbArray = color.match(/\d+/g)?.map(Number);
  } else {
    throw new Error('Unsupported color format');
  }
  const [r, g, b] = rgbArray || [0, 0, 0];
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

function JsonEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const editor = useRef<ace.Editor | null>(null);
  const [editable, setEditable] = useBoolean(true);
  const [copyState, setCopyState] = useSafeState<CopyState>(CopyState.UNCOPY);
  const [toolbarBgColor, setToolbarBgColor] = useSafeState<string>('');
  const [toolbarBorderColor, setToolbarBorderColor] = useSafeState<string>('');
  const [setting, { getItem: settingItem }] = useSetting();
  const toolbarFontColor = useMemo(() => {
    if (!toolbarBgColor) return '#333';
    return isDarkColor(toolbarBgColor) ? '#fff' : '#333';
  }, [toolbarBgColor]);

  const handleChange = useCallback(() => {
    if (editor.current) {
      setCopyState(CopyState.UNCOPY);
    }
  }, []);

  const jsonFormat = useCallback(
    (str: string) => {
      return JSON.stringify(
        JSON.parse(str),
        null,
        settingItem('json_editor::tab_size', 2),
      );
    },
    [settingItem],
  );
  const handleFormat = useCallback(() => {
    if (editor.current) {
      const value = editor.current.getValue();
      try {
        const formattedJson = jsonFormat(value);
        editor.current.setValue(formattedJson, -1);
      } catch {
        const formattedJson = objToJson(objToJson(value));
        editor.current.setValue(formattedJson, -1);
      }
    }
  }, []);

  const handleClear = useCallback(() => {
    editor.current?.setValue('');
    handleChange();
  }, []);

  const handleCopy = useCallback(async () => {
    if (editor.current) {
      try {
        const value = editor.current.getValue();
        await invoke('set_clipboard', { text: value });
        setCopyState(CopyState.COPY_SUCCESS);
      } catch {
        setCopyState(CopyState.COPY_FAILED);
      }
    }
  }, []);

  const loadTheme = useCallback(async (_theme: (typeof aceThemes)[number]) => {
    editor.current?.setTheme(`ace/theme/${_theme}`);
    requestAnimationFrame(() => {
      const aceGutter = document.querySelector<HTMLDivElement>('.ace_gutter');
      if (aceGutter) {
        const aceGutterStyle = getComputedStyle(aceGutter);
        setToolbarBgColor(aceGutterStyle.backgroundColor);
        setToolbarBorderColor(aceGutterStyle.borderRightColor);
      }
    });
  }, []);

  const handleSave = useCallback(()=> {
    if (editor.current) {
      const value = editor.current.getValue();
      invoke('save_file', {
        content: value
      })
    }
  }, [])

  useEffect(() => {
    if (setting && editor.current) {
      loadTheme(settingItem('json_editor::theme')!);
      editor.current
        .getSession()
        .setTabSize(settingItem('json_editor::tab_size'));
      const formatShortcut = settingItem(
        'json_editor::format_shortcut',
      ).replace(/\+/g, '-');
      editor.current.commands.addCommand({
        name: 'format',
        bindKey: { win: formatShortcut, mac: formatShortcut },
        exec: handleFormat,
      });
    }
  }, [setting]);

  useEffect(() => {
    if (editable) {
      editor.current?.setReadOnly(false);
      return;
    }
    editor.current?.setReadOnly(true);
  }, [editable]);

  useEffect(() => {
    if (editorRef.current) {
      editor.current = ace.edit(editorRef.current);
      editor.current.getSession().setMode('ace/mode/json');
      editor.current.getSession().setTabSize(2);
      editor.current.getSession().setUseSoftTabs(true);
      editor.current.setShowPrintMargin(true);
      editor.current.setPrintMarginColumn(90);
      editor.current.$blockScrolling = Infinity;
      editor.current.focus();
    }
    systemEmitter.on(SystemEvent.ESC, ()=> {
      invoke('close_window', {
        id: 'json_editor'
      })
    })
    return () => {
      if (editor.current) {
        editor.current.destroy();
      }
      systemEmitter.off(SystemEvent.ESC);
    };
  }, []);
  return (
    <div className='h-screen w-screen flex flex-col overflow-hidden'>
      <div
        className="flex py-2 px-4 shadow bg-stone-200 items-center border-b"
        style={{
          backgroundColor: toolbarBgColor,
          color: toolbarFontColor,
          borderColor: toolbarBorderColor,
        }}
      >
        {editable ? (
          <Tooltip title="禁止编辑">
            <ComponentWithRef>
              <MdOutlineEdit
                className="cursor-pointer hover:text-indigo-500"
                onClick={setEditable.setFalse}
                size={20}
              />
            </ComponentWithRef>
          </Tooltip>
        ) : (
          <Tooltip title="允许编辑">
            <ComponentWithRef>
              <MdOutlineEditOff
                className="cursor-pointer hover:text-indigo-500"
                onClick={setEditable.setTrue}
                size={20}
              />
            </ComponentWithRef>
          </Tooltip>
        )}
        <Tooltip title="清空">
          <ComponentWithRef>
            <MdDeleteOutline
              className="cursor-pointer ml-2 hover:text-indigo-500"
              onClick={handleClear}
              size={22}
            />
          </ComponentWithRef>
        </Tooltip>
        <Tooltip title="格式化">
          <ComponentWithRef>
            <MdOutlineFormatPaint
              className="cursor-pointer ml-2 hover:text-indigo-500"
              onClick={handleFormat}
              size={20}
            />
          </ComponentWithRef>
        </Tooltip>
        {copyState === CopyState.COPY_SUCCESS ? (
          <Tooltip title="复制成功">
            <ComponentWithRef>
              <FaRegCircleCheck
                className="cursor-pointer ml-2 hover:text-indigo-500"
                size={18}
              />
            </ComponentWithRef>
          </Tooltip>
        ) : copyState === CopyState.COPY_FAILED ? (
          <Tooltip title="重新复制">
            <ComponentWithRef>
              <AiOutlineCloseCircle
                className="cursor-pointer ml-2 hover:text-indigo-500"
                onClick={handleCopy}
                size={20}
              />
            </ComponentWithRef>
          </Tooltip>
        ) : (
          <Tooltip title="复制">
            <ComponentWithRef>
              <IoMdCopy
                className="cursor-pointer ml-2 hover:text-indigo-500"
                onClick={handleCopy}
                size={20}
              />
            </ComponentWithRef>
          </Tooltip>
        )}
        <Tooltip title="保存">
          <ComponentWithRef>
            <MdOutlineDriveFileMove
              className="cursor-pointer ml-2 hover:text-indigo-500"
              onClick={handleSave}
              size={22}
            />
          </ComponentWithRef>
        </Tooltip>
      </div>
      <div
        ref={editorRef}
        className="flex-1 hover:text-indigo-500"
        onInput={handleChange}
      />
    </div>
  );
}

export default JsonEditor;
