// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/userStore' // Import the user store
import './assets/main.css'
import { supabase } from './lib/supabaseClient'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

// Fetch user session when the app initializes
const userStore = useUserStore()

userStore
  .initializeUser()
  .catch((error) => {
    console.error('Error during session restoration:', error.message)
  })
  .finally(() => {
    // Mount the app regardless of session restoration success
    app.mount('#app')
  })

window.supabase = supabase
