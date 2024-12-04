<template>
  <el-card class="min-w-[420px] w-fit mx-auto mt-[30vh]">
    <div class="flex items-center flex-col mb-6">
      <Logo class="w-[50px] h-[50px]" />
      <div class="text-4xl font-bold mt-4">{{ t('signIn.title') }}</div>
      <div class="text-sm text-gray-500 mt-1">{{ t('signIn.subTitle') }}</div>
    </div>
    <el-form ref="formRef" :rules="rules" :model="formData" @submit.prevent="handleSubmit">
      <el-form-item prop="account">
        <el-input :prefix-icon="User" :model-value="formData.account" :placeholder="t('signIn.placeholder.account')"
          @input="e => handleInput('account', e)" clearable />
      </el-form-item>
      <el-form-item prop="password">
        <el-input show-password type="password" :prefix-icon="Lock" :model-value="formData.password"
          :placeholder="t('signIn.placeholder.password')" @input="e => handleInput('password', e)" clearable />
      </el-form-item>
      <el-form-item prop="captcha" v-if="captchaShow" :rules="captchaRules">
        <div class="flex w-full">
          <el-input type="text" :model-value="formData.captcha" :placeholder="t('signIn.placeholder.captcha')"
            @input="e => handleInput('captcha', e)" clearable class="flex-1" />
          <img :src="captchaURL" class="w-[80px] ml-3 rounded border cursor-pointer hover:border-gray-300"
            @click="handleCaptchaRefresh" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button native-type="submit" class="w-full" type="primary" :loading="loading">{{ t('btn.signIn')
          }}</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { getCaptcha } from '@/api/signIn';
import Logo from '@/assets/Logo.vue';
import { useUserStore } from '@/store/modules/user';
import { Lock, User } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useBoolean, useLockFn, useSetState } from 'vue-hooks-plus';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

interface FormData {
  account: string;
  password: string;
  captcha: string;
  captchaId: string;
}
const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const formRef = ref<FormInstance>();
const [loading, setLoading] = useBoolean(false);
const [captchaShow, setCaptchaShow] = useBoolean();
const captchaURL = ref('');
const captchaRules = [
  {
    required: true,
    message: t('signIn.hint.captcha'),
    trigger: 'blur',
  },
];
const rules = reactive({
  account: [
    {
      required: true,
      message: t('signIn.hint.account'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: t('signIn.hint.password'),
      trigger: 'blur',
    },
  ],
});
const [formData, setFormData] = useSetState<FormData>({
  account: '',
  password: '',
  captcha: '',
  captchaId: '',
});
const handleInput = (type: keyof FormData, value: string) => {
  setFormData({
    [type]: value,
  });
};

const handleCaptchaRefresh = async () => {
  try {
    const { data } = await getCaptcha();
    setCaptchaShow.set(data.openCaptcha);
    if (data.openCaptcha) {
      setFormData({
        captchaId: data.captchaId,
      });
    }
    captchaURL.value = data.picPath;
  } catch (error) {
    console.error(error);
  }
};
handleCaptchaRefresh();
const handleSubmit = useLockFn(async () => {
  setLoading.setTrue();
  await formRef.value?.validate();
  try {
    await userStore.signIn({
      captcha: formData.value.captcha,
      captchaId: formData.value.captchaId,
      password: formData.value.password,
      username: formData.value.account,
    });
    router.replace('/');
  } catch (error) {
    handleCaptchaRefresh();
  } finally {
    setLoading.setFalse();
  }
});
</script>
