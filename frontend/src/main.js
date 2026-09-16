import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './store/authStore';


import './assets/styles/custom.scss';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
const authStore = useAuthStore();
authStore.rehydrate();
app.use(router);

app.mount('#app');
