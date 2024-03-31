import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import axios from 'axios';

axios.defaults.baseURL = 'https://sports-scheduling-yzsb.onrender.com';
const app = createApp(App);
app.use(BootstrapVue3);
app.use(router).mount('#app');
