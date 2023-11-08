import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import "./assets/css/app.css"
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify"
import "vue3-toastify/dist/index.css"

import Vue3Datatable from "@bhplugin/vue3-datatable"
import "@bhplugin/vue3-datatable/dist/style.css"
import piniaPersist from 'pinia-plugin-persist'

const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App)
  .use(router)
  .use(pinia)
  .use(Vue3Toastify, {
    autoClose: 2000,
  } as ToastContainerOptions)
  .component('Vue3Datatable', Vue3Datatable)
  .mount("#app")
