import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Setting from '@/pages/Setting';
import JsonEditor from '@/pages/JsonEditor';
import Translate from '@/pages/Translate';

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
  }
]

const router = createBrowserRouter(routes);

export default router;
