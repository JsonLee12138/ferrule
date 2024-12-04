import type { UserInfo } from '../entities/user';

export interface CaptchaVO {
  captchaId: string;
  openCaptcha: true;
  picPath: string;
}

export interface SignInVO {
  token: string;
  user: UserInfo;
}
