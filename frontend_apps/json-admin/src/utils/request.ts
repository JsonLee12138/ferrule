import { HttpContentType, HttpResponseStatus } from '@/enums/http';
import { t } from '@/locale';
import type { AnyObject } from '@/types/global';
import type { ResultWithData } from '@/types/request';
import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { type AbortPromise, abortPromise } from 'jsonlee-promise';
import { get as _get_ } from 'lodash-es';
import { addRequestLoading, removeRequestLoading } from './loading';
import { showToast } from './toast';
import { useUserStore } from '@/store/modules/user';

const requestQueue: AbortController[] = [];
const instance = axios.create({
  baseURL: import.meta.env.J_API_URL,
  headers: {
    'Content-Type': HttpContentType.JSON,
  },
  timeout: 30000,
  // withCredentials: true
});

interface CusAxiosConfig extends InternalAxiosRequestConfig {
  loading: boolean;
  toastError: boolean;
  toastSuccess: boolean;
  upload: boolean;
}

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const _config = config as unknown as CusAxiosConfig;
  _config.toastError ??= true;
  _config.loading ??= true;
  if (_config.loading) {
    addRequestLoading();
  }
  if (_config.upload) {
    config.headers.set('Content-Type', HttpContentType.FORM);
  }
  const userStore = useUserStore();
  const token = userStore.getToken();
  if(token){
    _config.headers.set(import.meta.env.J_TOKEN_NAME, token);
  }
  // 设置token
  return _config as unknown as InternalAxiosRequestConfig;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response;
    const config = response.config as unknown as CusAxiosConfig;
    if (config.loading) {
      requestAnimationFrame(removeRequestLoading);
    }
    if (
      _get_(data, import.meta.env.J_REQUEST_CODE_KEY) ===
      HttpResponseStatus.SUCCESS
    ) {
      if (config.toastSuccess) {
        showToast({
          message: _get_(data, import.meta.env.J_REQUEST_MESSAGE_KEY),
          type: 'success',
        });
      }
      return data;
    }
    if (config.toastError) {
      showToast({
        message: _get_(data, import.meta.env.J_REQUEST_MESSAGE_KEY),
        type: 'error',
      });
    }
    if(_get_(data, import.meta.env.J_REQUEST_CODE_KEY) === HttpResponseStatus.AUTH_EXPIRED) {
      const userStore = useUserStore();
      userStore.clearSignIn();
    }
    return Promise.reject(data);
  },
  (err) => {
    const { config, response } = err;
    if (config.loading) {
      requestAnimationFrame(removeRequestLoading);
    }
    if (err.message.includes('timeout')) {
      showToast({
        message: t('request.timeout'),
        type: 'error',
      });
    } else if (err.message.includes('Network Error')) {
      showToast({
        message: t('request.networkError'),
        type: 'error',
      });
    } else if (response?.status) {
      showToast({
        message: t(`request.${response.status}`),
        type: 'error',
      });
    }
    // console.log(err, '请求错误');
    return Promise.reject(err);
  },
);

export const get = <T = AnyObject, P extends object = AnyObject>(
  url: string,
  params: P = {} as P,
  options: Partial<CusAxiosConfig> = {},
) => {
  const controller = new AbortController();
  requestQueue.push(controller);
  return abortPromise(
    instance.get(url, { params, ...options }),
    controller,
  ) as unknown as AbortPromise<ResultWithData<T>>;
};

export const post = <T = AnyObject, D extends object = AnyObject>(
  url: string,
  data: D = {} as D,
  options: Partial<CusAxiosConfig> = {},
) => {
  const controller = new AbortController();
  requestQueue.push(controller);
  return abortPromise(
    instance.post(url, data, options),
    controller,
  ) as unknown as AbortPromise<ResultWithData<T>>;
};

export const put = <T = AnyObject, D extends object = AnyObject>(
  url: string,
  data: D = {} as D,
  options: Partial<CusAxiosConfig> = {},
) => {
  const controller = new AbortController();
  requestQueue.push(controller);
  return abortPromise(
    instance.put(url, data, options),
    controller,
  ) as unknown as AbortPromise<ResultWithData<T>>;
};

export const del = <T = AnyObject>(
  url: string,
  options: Partial<CusAxiosConfig> = {},
) => {
  const controller = new AbortController();
  requestQueue.push(controller);
  return abortPromise(
    instance.post(url, options),
    controller,
  ) as unknown as AbortPromise<ResultWithData<T>>;
};

export const download = <T = AnyObject, D extends object = AnyObject>(
  url: string,
  data: D = {} as D,
  options: Partial<CusAxiosConfig> = {},
) => {
  const controller = new AbortController();
  requestQueue.push(controller);
  return abortPromise(
    instance.post(url, data, { ...options, responseType: 'blob' }),
    controller,
  ) as unknown as AbortPromise<ResultWithData<T>>;
};

export const upload = <T = AnyObject, D extends object = AnyObject>(
  url: string,
  data: D = {} as D,
  options: Partial<CusAxiosConfig> = {},
) => {
  const controller = new AbortController();
  requestQueue.push(controller);
  return abortPromise(
    instance.post(url, data, {
      ...options,
      upload: true,
    } as unknown as AxiosRequestConfig),
    controller,
  ) as unknown as AbortPromise<ResultWithData<T>>;
};
