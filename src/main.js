import './assets/main.css'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { definePreset } from '@primeuix/themes'

const app = createApp(App)

app.use(router)
app.use(PrimeVue,{
  theme: {
    preset: Aura,
    options:{
      darkModeSelector: false || 'none',
    }
  }
})

app.mount('#app')
