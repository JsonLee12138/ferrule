import { defineStore } from 'pinia';
import { encrypt } from '../serializers/encrypt';

export const useMenuStore = defineStore(
  'menu',
  () => {

  },
  {
    persist: {
      key: 'menu',
      serializer: encrypt,
    },
  },
);
