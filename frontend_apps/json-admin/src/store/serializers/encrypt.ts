import CryptoJS from 'crypto-js';
import type { StateTree } from 'pinia';

export const encrypt = {
  serialize(value: StateTree) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(value),
      import.meta.env.J_ENCRYPT_KEY,
    ).toString();
  },
  deserialize(value: string) {
    const res = CryptoJS.AES.decrypt(
      value,
      import.meta.env.J_ENCRYPT_KEY,
    ).toString(CryptoJS.enc.Utf8);
    return JSON.parse(res);
  },
};
