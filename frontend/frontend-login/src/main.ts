import { createApp } from "vue"
import { createPinia } from 'pinia'
import App from "./App.vue"
import {createRouter, createWebHistory} from "vue-router";
import {routes} from "./routes";
// @ts-ignore
import { msalPlugin } from 'vue3-msal'

const app = createApp(App)
const pinia = createPinia()
app.use(msalPlugin, {
    auth: {
        clientId: 'ade2b049-cf86-4894-9bf5-d5082c50c6c6'
    }
});

const router = createRouter({
    history: createWebHistory(),
    routes, // short for `routes: routes`
})


app.use(pinia)
app.use(router)
app.mount("#app")
