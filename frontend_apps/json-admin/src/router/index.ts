import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/components/Layout/index.vue'),
      // redirect: '/index'
      // TODO: 路由守卫去做动态的重定向
    },
  ],
});

for (const route of routes) {
  if (route.meta?.inLayout) {
    router.addRoute('layout', route);
  } else {
    if (!route.path.startsWith('/')) {
      route.path = `/${route.path}`;
    }
    router.addRoute(route);
  }
}

router.addRoute({
  path: '/:pathMatch(.*)*',
  redirect: '/404'
})

if(__DEV__){
  console.group("路由: ")
  console.table(router.getRoutes().map(item=> ({
    path: item.path,
    name: item.name
  })))
  console.groupEnd();
}

export default router;
