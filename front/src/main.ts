import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from "./plugins/vuetify";

import "vuetify/styles";
import App from './App.vue'
import router from './router'
import "@mdi/font/css/materialdesignicons.css";
import { MaskInput } from 'maska'

const app = createApp(App)

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.directive('mask', {
    mounted(el, binding) {
        new MaskInput(el, {
            mask: binding.value
        })
    }
})
app.mount('#app')
