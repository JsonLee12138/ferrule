import '@/styles/style.scss';
import '@/styles/tailwind.css';
import '@/styles/mui.scss';
import { createTheme, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import router from '@/router';
import { RecoilRoot } from 'recoil';
import { Suspense, useEffect } from 'react';
import { systemEmitter, SystemEvent } from './utils/sysEmitter';
import useLoadingDelay from './hooks/useLoadingDelay';
import { AnimatePresence } from 'motion/react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
  },
});

const App = () => {
  const [ready] = useLoadingDelay(800);
  useEffect(() => {
    let isComposing = false;
    window.addEventListener('compositionstart', () => {
      isComposing = true;
    });
    window.addEventListener('compositionend', () => {
      isComposing = false;
    });
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape' && !isComposing) {
        systemEmitter.emit(SystemEvent.ESC);
      }
    });
    return () => {
      window.removeEventListener('compositionstart', () => {});
      window.removeEventListener('compositionend', () => {});
      window.removeEventListener('keyup', () => {});
    };
  }, []);

  useEffect(()=> {
    let root = document.getElementById('root');
    let loader = document.getElementById('j-loader-container');
    if(ready){
      root?.classList.remove('hidden');
      loader?.classList.add('hidden');
      root = null;
      loader = null;
    }
    return ()=> {
      root = null;
      loader = null;
    }
  }, [ready])
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <AnimatePresence>
          <Suspense>
            <RouterProvider router={router} />
          </Suspense>
        </AnimatePresence>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;
