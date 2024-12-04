import { cloneDeep } from "lodash-es";

export const envDefineSetup = (...data: object[]) => {
  const res = {};
  const source = Object.assign({},...cloneDeep(data));
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const val = source[key];
      res[key] = JSON.stringify(val);
    }
  }
  return res;
}
