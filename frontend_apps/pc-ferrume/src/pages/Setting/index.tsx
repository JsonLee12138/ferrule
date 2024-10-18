import { FaRegKeyboard } from 'react-icons/fa';
import Switch from '@/components/Switch';
import {
  useCallback,
  useEffect,
  type ChangeEventHandler,
  type FocusEventHandler,
} from 'react';
import { TbTableShortcut } from 'react-icons/tb';
import { GrLanguage } from 'react-icons/gr';
import { FaLanguage } from 'react-icons/fa6';
import SelectLng from '@/components/SelectLng';
import { HiMiniArrowRightStartOnRectangle } from 'react-icons/hi2';
import { PiSelectionBackgroundBold } from 'react-icons/pi';
import { CgMenuCake } from 'react-icons/cg';
import SetHotKey from '@/components/SetHotKey';
import Select from '@/components/Select';
import { aceThemeOptions } from '@/constant/aceTheme';
import { useSetting } from '@/store/setting';
import { systemEmitter, SystemEvent } from '@/utils/sysEmitter';
import { invoke } from '@tauri-apps/api/core';
import { PiWarningDuotone } from 'react-icons/pi';

function Setting() {
  const [_, { setItem, getItem }] = useSetting();

  const handleJsonEditorTabSizeChange = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((e) => {
    const value = e.target.value;
    if (value === '') {
      setItem('json_editor::tab_size', '' as unknown as number, true);
      return;
    }
    const num = Number(value);
    if (isNaN(num)) return;
    setItem('json_editor::tab_size', num);
  }, []);

  const handleJsonEditorTabSizeBlur = useCallback<
    FocusEventHandler<HTMLInputElement>
  >((e) => {
    const value = e.target.value;
    if (!value) {
      setItem('json_editor::tab_size', 2);
    }
  }, []);

  useEffect(() => {
    systemEmitter.on(SystemEvent.ESC, () => {
      invoke('close_window', {
        id: 'setting',
      });
    });
    return () => {
      systemEmitter.off(SystemEvent.ESC);
    };
  });

  return (
    <div className="w-full h-screen overflow-y-auto p-5">
      <div className="flex items-center justify-center">
        <PiWarningDuotone color="#f59e0b" size={20} />
        <span className="ml-2 text-sm">
          注: 所有快捷键和应用设置需重启后生效
        </span>
      </div>
      <h1 className="text-sm font-bold indent-2">翻译</h1>
      <div className="border rounded bg-transparent px-2 mt-2 shadow-sm">
        <div className="flex items-center h-10 justify-between border-b-stone-200 border-b">
          <div className="flex items-center py-2">
            <FaRegKeyboard className="mr-2" />
            <p className="text-sm ml-2">是否启用快捷键</p>
          </div>
          <Switch<boolean>
            value={getItem('translate::shortcut::enabled', false)}
            checkedValue={true}
            uncheckedValue={false}
            onChange={(e: boolean) =>
              setItem('translate::shortcut::enabled', e)
            }
          />
        </div>
        <div className="flex items-center h-10 justify-between border-b-stone-200 border-b">
          <div className="flex items-center py-2">
            <TbTableShortcut className="mr-2" />
            <p className="text-sm ml-2">键盘快捷键</p>
          </div>
          <SetHotKey
            value={getItem('translate::shortcut::hotkey', '')}
            onChange={(_, e: string) =>
              setItem('translate::shortcut::hotkey', e)
            }
          />
        </div>
        <div className="flex items-center h-10 justify-between border-b-stone-200 border-b">
          <div className="flex items-center py-2">
            <GrLanguage className="mr-2" />
            <p className="text-sm ml-2">主要语言</p>
          </div>
          <SelectLng
            value={getItem('translate::system_language', '')}
            onChange={(e) => setItem('translate::system_language', e)}
          />
        </div>
        <div className="flex items-center h-10 justify-between">
          <div className="flex items-center py-2">
            <FaLanguage className="mr-2" />
            <p className="text-sm ml-2">翻译目标语言</p>
          </div>
          <SelectLng
            value={getItem('translate::target_language', '')}
            onChange={(e) => setItem('translate::target_language', e)}
          />
        </div>
      </div>
      <h1 className="text-sm font-bold indent-2 mt-5">JSON 编辑器</h1>
      <div className="border rounded bg-transparent px-2 mt-2 shadow-sm">
        <div className="flex items-center h-10 justify-between border-b-stone-200 border-b">
          <div className="flex items-center py-2">
            <FaRegKeyboard className="mr-2" />
            <p className="text-sm ml-2">是否启用快捷键</p>
          </div>
          <Switch<boolean>
            value={getItem('json_editor::open_shortcut::enabled', false)}
            checkedValue={true}
            uncheckedValue={false}
            onChange={(e) => setItem('json_editor::open_shortcut::enabled', e)}
          />
        </div>
        <div className="flex items-center h-10 justify-between border-b-stone-200 border-b">
          <div className="flex items-center py-2">
            <TbTableShortcut className="mr-2" />
            <p className="text-sm ml-2">键盘快捷键</p>
          </div>
          <SetHotKey
            value={getItem('json_editor::open_shortcut::hotkey', '')}
            onChange={(_, e: string) =>
              setItem('json_editor::open_shortcut::hotkey', e)
            }
          />
        </div>
        <div className="flex items-center h-10 justify-between border-b-stone-200 border-b">
          <div className="flex items-center py-2">
            <TbTableShortcut className="mr-2" />
            <p className="text-sm ml-2">格式化代码快捷键</p>
          </div>
          <SetHotKey
            value={getItem('json_editor::format_shortcut', '')}
            onChange={(_, e: string) =>
              setItem('json_editor::format_shortcut', e)
            }
          />
        </div>
        <div className="flex items-center h-10 justify-between border-b-stone-200 border-b">
          <div className="flex items-center py-2">
            <TbTableShortcut className="mr-2" />
            <p className="text-sm ml-2">缩进字符</p>
          </div>
          <input
            value={getItem('json_editor::tab_size', '')}
            className={
              'w-fit text-center pr-1.5 rounded-md py-1 focus:outline outline-indigo-600 bg-stone-200/60 text-[#333] text-sm/6 outline-[3px] hover:shadow'
            }
            onChange={handleJsonEditorTabSizeChange}
            onBlur={handleJsonEditorTabSizeBlur}
          />
        </div>
        <div className="flex items-center h-10 justify-between">
          <div className="flex items-center py-2">
            <TbTableShortcut className="mr-2" />
            <p className="text-sm ml-2">编辑器主题</p>
          </div>
          <Select
            options={aceThemeOptions}
            searchable
            value={getItem('json_editor::theme', '')}
            onChange={(e) => setItem('json_editor::theme', e)}
          />
        </div>
      </div>
      <h1 className="text-sm font-bold indent-2 mt-5">应用</h1>
      <div className="border rounded bg-transparent px-2 mt-2 shadow-sm">
        <div className="flex items-center h-10 justify-between border-b-stone-200 border-b">
          <div className="flex items-center py-2">
            <HiMiniArrowRightStartOnRectangle className="mr-2" />
            <p className="text-sm ml-2">是否开机自启</p>
          </div>
          <Switch<boolean>
            value={getItem('system::start_at_login', false)}
            checkedValue={true}
            uncheckedValue={false}
            onChange={(e) => setItem('system::start_at_login', e)}
          />
        </div>
        <div className="flex items-center h-10 justify-between border-b-stone-200 border-b">
          <div className="flex items-center py-2">
            <PiSelectionBackgroundBold className="mr-2" />
            <p className="text-sm ml-2">是否静默启动</p>
          </div>
          <Switch<boolean>
            value={getItem('system::silent_start', false)}
            checkedValue={true}
            uncheckedValue={false}
            onChange={(e) => setItem('system::silent_start', e)}
          />
        </div>
        <div className="flex items-center h-10 justify-between">
          <div className="flex items-center py-2">
            <CgMenuCake className="mr-2" />
            <p className="text-sm ml-2">是否在菜单栏显示</p>
          </div>
          <Switch<boolean>
            value={getItem('system::show_tray_icon', false)}
            checkedValue={true}
            uncheckedValue={false}
            onChange={(e) => setItem('system::show_tray_icon', e)}
          />
        </div>
      </div>
    </div>
  );
}

export default Setting;
