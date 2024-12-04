import { getUserInfo as getUserInfoApi, signIn as signInApi } from '@/api/signIn';
import type { SignInDto } from '@/types/dto/signIn';
import { defineStore } from 'pinia';
import { encrypt } from '../serializers/encrypt';
import { reactive } from 'vue';
import router from '@/router';

export const useUserStore = defineStore(
  'user',
  () => {
    let getUserInfoFlag = false;
    const state = reactive({
      token: '',
      userInfo: {}
    })
    const setToken = (value: string) => {
      state.token = value;
    };
    const getToken = (): string => {
      return state.token;
    };
    const signIn = async (data: SignInDto) => {
      try {
        const res = await signInApi(data);
        setToken(res.data.token);
        state.userInfo = res.data.user;
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    };
    const getUserInfo = () => {
      if(!state.token && getUserInfoFlag) {
        refreshUserInfo()
      }
      return state.userInfo;
    };
    const refreshUserInfo = async () => {
      try {
        const res = await getUserInfoApi();
        state.userInfo = res.data;
        getUserInfoFlag = true;
        return res;
      } catch (error) {
        return Promise.reject(error);
      }
    }
    const clearSignIn = () => {
      getUserInfoFlag = false;
      state.token = '';
      state.userInfo = {};
      router.replace(import.meta.env.J_LOGIN_PATH);
    }
    const signOut = async () => {
      try {

      } catch (error) {

      } finally {
        clearSignIn();
      }
    }
    return { state, setToken, getToken, signIn, getUserInfo, refreshUserInfo, clearSignIn, signOut };
  },
  {
    persist: {
      key: 'user',
      serializer: encrypt,
      pick: ['state.token', 'state.userInfo']
    },
  },
);
