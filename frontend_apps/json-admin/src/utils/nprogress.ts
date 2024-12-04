import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '@/styles/nprogress.scss';

let count = 0;

NProgress.configure({
  showSpinner: true,
});

export const startNProgress = () => {
  if (!count) {
    NProgress.start();
  }
  count++;
};

export const endNProgress = () => {
  if (count > 0) {
    count--;
  }
  if (!count) {
    NProgress.done();
  }
};
