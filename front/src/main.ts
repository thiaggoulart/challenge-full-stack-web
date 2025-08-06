import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from "./plugins/vuetify";

import "vuetify/styles";
import App from './App.vue'
import router from './router'
import "@mdi/font/css/materialdesignicons.css";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
