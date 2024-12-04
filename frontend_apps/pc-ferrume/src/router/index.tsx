import { createBrowserRouter, type RouteObject } from 'react-router-dom';
// import Setting from '@/pages/Setting';
// import JsonEditor from '@/pages/JsonEditor';
// import Translate from '@/pages/Translate';
// import URLDecode from '@/pages/URLDecode';
import { lazy } from 'react';

const Setting = lazy(()=> import('@/pages/Setting'));
const Translate = lazy(()=> import('@/pages/Translate'));
const URLDecode = lazy(()=> import('@/pages/URLDecode'));
const JsonEditor = lazy(()=> import('@/pages/JsonEditor'));
const Note = lazy(()=> import('@/pages/Note'));
const Layout = lazy(()=> import('@/components/Layout'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: ':id',
        element: <Note />
      }
    ]
  },
  {
    path: '/setting',
    element: <Setting />,
  },
  {
    path: '/json-editor',
    element: <JsonEditor />
  },
  {
    path: '/translate',
    element: <Translate />
  },
  {
    path: 'url-decode',
    element: <URLDecode />
  }
]

const router = createBrowserRouter(routes);

export default router;
