<script setup lang="js">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()

const profileReady = ref(false)

onMounted(async () => {
  if (!userStore.profile) {
    await userStore.fetchUser()
  }
  profileReady.value = true
})

const isOnSkillsPage = computed(() => route.path.startsWith('/skills'))
const isAdmin = computed(() => userStore.profile?.role?.toLowerCase() === 'admin')

const sidebarLinks = computed(() => {
  const links = [
    { name: 'Dashboard', path: '/', icon: '🏠' },
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

const emit = defineEmits(['add-skill'])
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

    <!-- ✅ Always visible debug output
    <div style="color: yellow; font-size: 12px; padding: 8px;">
      profileReady: {{ profileReady }} <br>
      role: {{ userStore.profile?.role }} <br>
      isAdmin: {{ isAdmin }} <br>
      currentRoute: {{ route.path }} <br>
      isOnSkillsPage: {{ isOnSkillsPage }}
    </div> -->

    <!-- Divider -->
    <hr v-if="profileReady && isAdmin && isOnSkillsPage" class="divider" />

    <!-- Add Skill Button for Admins on /skills -->
    <div v-if="profileReady && isAdmin && isOnSkillsPage" class="nav-list">
      <a class="card-link" @click.prevent="emit('add-skill')">
        ➕ Add Skill
      </a>
    </div>
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
  box-shadow: 4px 0 8px var(--electric-purple);
  border-top: 1px solid var(--electric-purple);
  border-right: 1px solid var(--electric-purple);
}

.nav-list {
  display: grid;
  gap: 10px;
  padding: 16px 8px 0 8px;
}

.card-link {
  background-color: var(--electric-purple);
  color: white;
  padding: 12px;
  border-radius: 8px;
  margin: 5px 0;
  display: block;
  text-decoration: none;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.card-link:hover {
  background-color: #4b5563;
}

.divider {
  margin: 16px 12px 0;
  border: none;
  border-top: 1px solid #6b7280;
}
</style>
