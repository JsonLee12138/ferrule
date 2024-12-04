import { t } from '@/locale';
import { ElLoading, type LoadingOptionsResolved } from 'element-plus';
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading.mjs';
import 'element-plus/es/components/loading/style/css';
import { endNProgress, startNProgress } from './nprogress';

let count = 0;
let loadingInstance: LoadingInstance | null = null;

type LoadingOptions = Partial<
  Omit<LoadingOptionsResolved, 'parent' | 'target'> & {
    target: HTMLElement | string;
    body: boolean;
  }
>;

export const createLoading = (options: LoadingOptions = {}) => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: t('loading'),
    background: 'rgba(0,0,0,.3)',
    fullscreen: true,
    ...options,
  });
  startNProgress();
};

export const clearLoading = () => {
  loadingInstance?.close();
  endNProgress();
};

export const addRequestLoading = () => {
  if (!count) {
    createLoading();
  }
  count++;
};

export const removeRequestLoading = () => {
  if (count > 0) {
    count--;
  }
  if (!count) {
    clearLoading();
  }
};
