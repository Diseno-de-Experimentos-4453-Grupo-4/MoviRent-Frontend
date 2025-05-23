import './assets/main.css'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { app as firebaseApp } from './firebase'
import { createPinia } from 'pinia'
import { ToastService } from 'primevue'

const pinia = createPinia(App)
const app = createApp(App);

app.use(router)
app.use(PrimeVue,{
  theme: {
    preset: Aura,
    options:{
      darkModeSelector: false || 'none',
    }
  }
})


app.use(pinia)
app.use(ToastService)
app.mount('#app')
