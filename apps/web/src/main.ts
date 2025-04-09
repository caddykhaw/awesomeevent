import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { clerkPlugin } from '@clerk/clerk-vue'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

// Initialize Clerk
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
app.use(clerkPlugin, {
  publishableKey,
})

// Initialize router (we'll add routes later)
const router = createRouter({
  history: createWebHistory(),
  routes: [],
})

app.use(router)
app.use(pinia)
app.use(VueQueryPlugin)

app.mount('#app') 