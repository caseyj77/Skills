// src/main.js
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/userStore' // Import the user store
import './assets/main.css'
import { supabase } from './lib/supabaseClient'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia) // Register Pinia first
app.use(router)

// Ensure Pinia is fully set up before using the store
app.mount('#app')

// Fetch user session once the app is mounted
const userStore = useUserStore()

userStore
  .fetchUser() // Renaming to fetchUser instead of initializeUser
  .catch((error) => {
    console.error('Error during session restoration:', error.message)
  })

// Attach Supabase globally (optional)
window.supabase = supabase
