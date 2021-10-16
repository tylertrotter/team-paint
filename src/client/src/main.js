import { createApp } from 'vue'
import { store } from './store'
import App from './App.vue'


const app = createApp(App);
app.config.globalProperties.$hostname = 'http://localhost:3000/';
app.use(store);
app.mount('#app');
