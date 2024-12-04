export const pageModules = import.meta.webpackContext('@/pages', {
  recursive: true,
  regExp: /index.vue$/,
  mode: 'lazy-once',
});

export const metaModules = import.meta.webpackContext('@/pages', {
  recursive: true,
  regExp: /meta.(ts|json|js)$/,
});
