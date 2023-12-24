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
import * as ElementPlusIconsVue from "@element-plus/icons-vue"

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

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(PDFPlugin)
app.use(pinia)
app.use(ElementPlus)
app.use(VueHtmlToPaper, options)
app.use(Vue3Toastify, {
  autoClose: 2000,
} as ToastContainerOptions)
app.component("Vue3Datatable", Vue3Datatable)
app.mount("#app")
