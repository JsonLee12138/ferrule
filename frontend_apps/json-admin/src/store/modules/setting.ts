import { defineStore } from 'pinia';
import { encrypt } from '../serializers/encrypt';
import { reactive } from 'vue';

interface Setting {
  elSize: "small" | "default" | "large";
}

export const useSettingStore = defineStore(
  'setting',
  () => {
    const setting = reactive<Setting>({
      elSize: 'default'
    })
    return { setting };
  },
  {
    persist: {
      key: 'setting',
      serializer: encrypt,
    },
  },
);
