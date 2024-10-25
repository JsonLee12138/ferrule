import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Setting from '@/pages/Setting';
import JsonEditor from '@/pages/JsonEditor';
import Translate from '@/pages/Translate';
import URLDecode from '@/pages/URLDecode';

const routes: RouteObject[] = [
  {
    path: '/setting',
    element: <Setting />
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
