import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import router from "./router"
import "./assets/css/app.css"
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify"
import "vue3-toastify/dist/index.css"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"

import Vue3Datatable from "@bhplugin/vue3-datatable"
import "@bhplugin/vue3-datatable/dist/style.css"
import piniaPersist from "pinia-plugin-persist"
import { PDFPlugin } from "vue3-pdfmake"
import VueHtmlToPaper from "vue-html-to-paper"

const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  styles: [
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    "https://unpkg.com/kidlat-css/css/kidlat.css",
  ],
  timeout: 1000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: window.document.title, // override the window title
}

const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App)
  .use(router)
  .use(PDFPlugin)
  .use(pinia)
  .use(ElementPlus)
  .use(VueHtmlToPaper, options)
  .use(Vue3Toastify, {
    autoClose: 2000,
  } as ToastContainerOptions)
  .component("Vue3Datatable", Vue3Datatable)
  .mount("#app")
