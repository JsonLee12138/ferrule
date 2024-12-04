import { zhCn } from 'element-plus/es/locales.mjs';
import { createI18n } from 'vue-i18n';
import en from './en.json';
import zhCN from './zh-CN.json';

export const messages = {
  en: {
    ...en,
  },
  'zh-CN': {
    ...zhCn,
    ...zhCN,
  },
};

if(__DEV__){
  console.group("语言: ")
  console.log(messages);
  console.groupEnd();
}

const i18n = createI18n({
  locale: navigator.language,
  messages,
  legacy: false,
});

export const setLanguage = (lan: string) => {
  // biome-ignore lint: 当前这里暂时不处理，后面再做处理
  i18n.global.locale = lan as any;
};

export const getLanguage = () => i18n.global.locale;

// biome-ignore lint: 当前这里暂时不处理，后面换成AnyObject
export const t = (key: string, options: Record<string, any> = {}) => {
  if (!key) return '';
  return i18n.global.t(key, options);
};

export default i18n;
