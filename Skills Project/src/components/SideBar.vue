<script setup lang="js">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const sidebarLinks = computed(() => {
  const links = [
    { name: 'Dashboard', path: '/skills', icon: '🏠' },
    { name: 'Skills', path: '/skills', icon: '📋' },
  ]

  if (userStore.profile?.role === 'admin') {
    links.push({ name: 'Admin Panel', path: '/', icon: '🛠️' })
  }

  if (userStore.profile?.role === 'manager') {
    links.push({ name: 'Team Skills', path: '/', icon: '👥' })
  }

  links.push({ name: 'Logout', path: '/', icon: '🚪' })

  return links
})
</script>

<template>
  <aside class="sidebar">
    <nav class="nav-list">
      <RouterLink
        v-for="link in sidebarLinks"
        :key="link.path"
        :to="link.path"
        class="card-link"
      >
        {{ link.icon }} {{ link.name }}
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 192px;
  min-width: 192px;
  background-color: var(--deep-midnight-blue);
  color: white;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--electric-purple);
  border-right: 1px solid var(--electric-purple);
}

.nav-list {
  display: grid;
  gap: 10px;
  padding: 16px 8px 0 8px;
}

.card-link {
  background-color: #373737;
  color: white;
  padding: 12px;
  border-radius: 8px;
  margin: 5px 0;
  display: block;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.card-link:hover {
  background-color: #4b5563;
}
</style>
