import { createApp } from 'vue';
import router from './router';
import './style.css';
import { createPinia } from 'pinia';
import App from './App.vue';
import vue3GoogleLogin from 'vue3-google-login'
import 'mapbox-gl/dist/mapbox-gl.css';


const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(vue3GoogleLogin, {
    clientId: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
})
app.mount('#app');