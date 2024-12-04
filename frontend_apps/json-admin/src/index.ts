import { createApp } from 'vue';
import App from './App.vue';
import './styles/tailwind.css';
import './styles/element.scss';
import './styles/style.scss';
import i18n from './locale';
import router from './router';
import store from './store';

const app = createApp(App);
app.use(router);
app.use(i18n);
app.use(store);
app.mount('#root');
