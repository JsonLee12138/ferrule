import { getSetting as getSettingApi } from "@/api/setting";
import type { Setting, SettingStoreHandler } from "@/types/setting";
import { useCallback, useEffect } from "react";
import { atom, useRecoilState } from "recoil";
import { get as _get_, cloneDeep, set as _set_ } from 'lodash-es';
import { camelCase } from "jsonlee-utils";
import { invoke } from '@tauri-apps/api/core';

const settingState = atom<Setting>({
  key: 'setting',
  default: void 0
});

const loadingState = atom<boolean>({
  key: 'settingLoading',
  default: false
});


export const useSetting = (): [Setting, SettingStoreHandler] => {
  const [flag, setFlag] = useRecoilState(loadingState);
  const [setting, setSetting] = useRecoilState(settingState);

  const getSetting = useCallback(async () => {
    try {
      const res = await getSettingApi();
      if (!flag) {
        setFlag(true);
      }
      setSetting(res);
    } catch (error) {
      console.error('getSetting', error)
    }
  }, [flag])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSettingItem = useCallback(<T = any>(key: string, defaultValue: T) => {
    if (!setting) {
      return defaultValue;
    }
    const _k_ = key.split('::').map(item => camelCase(item)).join('.');
    return _get_(setting, _k_) || defaultValue;
  }, [setting])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setItem = useCallback((key: string, value: any, onlyLocal?: boolean) => {
    setSetting(prev => {
      const _d_ = cloneDeep(prev);
      const _k_ = key.split('::').map(item => camelCase(item)).join('.');
      _set_(_d_, _k_, value);
      return _d_;
    })
    if (!onlyLocal) {
      invoke('set_setting_item', { key, value })
    }
  }, [])

  const getSettingOfFlag = useCallback(() => {
    if (!flag) {
      console.log(1);

      getSetting();
    }
  }, [flag])

  useEffect(() => {
    getSettingOfFlag();
  }, [getSettingOfFlag])

  return [setting, { refresh: getSetting, set: setSetting, setItem, getItem: getSettingItem }]
}
