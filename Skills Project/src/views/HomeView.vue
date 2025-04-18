<script setup lang="js">
import { useUserStore } from '@/stores/userStore'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import SideBar from '@/components/SideBar.vue'


const userStore = useUserStore()
const userSkills = ref([])
const loading = ref(true)

async function fetchUserSkills() {
  if (!userStore.user) return

  const { data, error } = await supabase
    .from('user_skills')
    .select('skill_id, rating, skills(name)')
    .eq('user_id', userStore.user.id)
    .order('rating', { ascending: false })

  if (error) {
    console.error('Error fetching user skills:', error)
    return
  }

  userSkills.value = data.map((item) => ({
    skill_id: item.skill_id,
    skill_name: item.skills.name,
    rating: item.rating,
  }))
}

onMounted(async () => {
  await userStore.fetchUser()
  await fetchUserSkills()
  loading.value = false
})
</script>

<template>
  <div class="dashboard-layout">
    <SideBar />

    <main class="dashboard-content">
      <h1>Welcome, {{ userStore.profile?.first_name || 'Guest' }}</h1>
      <p v-if="userStore.profile">Your Role: {{ userStore.profile.role }}</p>

      <h2>Your Dashboard</h2>
      <div v-if="userStore.profile?.role === 'Admin'">
        <p>You’re an Admin. You can manage skills and users.</p>
      </div>
      <div v-else-if="userStore.profile?.role === 'Manager'">
        <p>You’re a Manager. You’ll see team skill ratings here.</p>
      </div>
      <div v-else>
        <p>Welcome! Track your skill development here.</p>
      </div>


      <p v-if="loading">Loading your skills...</p>

      <ul v-else>
        <li v-for="rating in userSkills" :key="rating.skill_id">
          <strong>{{ rating.skill_name }}</strong> - Rating: {{ rating.rating }}/5
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.dashboard-content {
  flex: 1;
  padding: 24px;
  background-color: var(--deep-midnight-blue);
}
</style>
