import '@/styles/style.scss';
import '@/styles/tailwind.css';
import '@/styles/mui.scss';
import { createTheme, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router';
import router from '@/router';
import { RecoilRoot } from 'recoil';
import { useEffect } from 'react';
import { systemEmitter, SystemEvent } from './utils/sysEmitter';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1',
    },
  },
});

const App = () => {
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
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;
