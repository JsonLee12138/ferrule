/// <reference types="@rsbuild/core/types" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  // biome-ignore lint: vue框架自带, 不做处理
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare const __DEV__: boolean;

declare interface ImportMetaEnv {
  readonly J_SIDE_WIDTH_COLLAPSED: string;
  readonly J_SIDE_WIDTH_EXPAND: string;
  readonly J_API_URL: string;
  readonly J_REQUEST_CODE_KEY: string;
  readonly J_REQUEST_DATA_KEY: string;
  readonly J_REQUEST_LIST_PAGINATED_KEY: string;
  readonly J_REQUEST_LIST_KEY: string;
  readonly J_REQUEST_MESSAGE_KEY: string;
  readonly J_LOGIN_PATH: string;
  readonly J_ENCRYPT_KEY: string;
  readonly J_TOKEN_NAME: string;
}
