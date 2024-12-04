import { kebabCase } from 'lodash-es';
import type { RouteRecordRaw } from 'vue-router';
import { metaModules, pageModules } from './scan';
import { camelCase } from 'jsonlee-utils';

const getClearPath = (path: string, clear: string | RegExp) => {
  let res = '';
  if (path.startsWith('/')) {
    res = path.slice(1);
  } else if (path.startsWith('./')) {
    res = path.slice(2);
  }
  res = res.replace(clear, '');
  if (res.endsWith('/')) {
    res = res.slice(0, res.length - 1);
  }
  return res;
};

const pagePaths = pageModules.keys().map((item) => ({
  root: getClearPath(item, 'index.vue'),
  full: item,
}));
const metaPaths = metaModules.keys().map((item) => ({
  root: getClearPath(item, /index\.(js|ts|json)/),
  full: item,
}));
const routes: RouteRecordRaw[] = pagePaths.map((item) => {
  const meta = metaPaths.find((metaItem) => metaItem.root === item.root);
  const metaObj: unknown = meta ? metaModules(meta.full) : {};
  return {
    path: metaObj.path || kebabCase(item.root),
    component: () => pageModules(item.full),
    meta: metaObj,
    name: metaObj.name || camelCase(item.root, true)
  };
});

export default routes;
