import { ElMessage, type MessageParams } from 'element-plus';
import 'element-plus/es/components/message/style/css';
import { cloneDeep } from 'lodash-es';

let taostQueue: string[] = [];

interface Options {
  message: string;
  type: string;
  onClose: () => void;
}

export const showToast = (options: MessageParams = '') => {
  let opt: Options = {} as Options;
  if (typeof options === 'string') {
    opt.message = options;
  } else {
    opt = cloneDeep(options) as Options;
  }
  if (taostQueue.includes(opt.message)) {
    return;
  }
  taostQueue.push(opt.message);
  opt.onClose = () => {
    taostQueue = taostQueue.filter((item) => item !== opt.message);
  };
  console.log(opt, '>>>>');
  ElMessage(opt as unknown as MessageParams);
};
