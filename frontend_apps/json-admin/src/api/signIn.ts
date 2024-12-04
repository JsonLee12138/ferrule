import type { SignInDto } from '@/types/dto/signIn';
import type { UserInfo } from '@/types/entities/user';
import type { CaptchaVO, SignInVO } from '@/types/vo/signIn';
import { get, post } from '@/utils/request';

export const getCaptcha = () => post<CaptchaVO>('/base/captcha');

export const signIn = (data: SignInDto) =>
  post<SignInVO, SignInDto>('/base/login', data, { toastSuccess: true });

export const getUserInfo = () => get<UserInfo>('/user/getUserInfo');
