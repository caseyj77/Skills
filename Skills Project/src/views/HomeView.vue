<script>
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';

export default {
  setup() {
    const userStore = useUserStore();
    const userSkills = ref([]);
    const loading = ref(true); // 👈 new loading state

    async function fetchUserSkills() {
      if (!userStore.user) return;

      const { data, error } = await supabase
        .from('user_skills')
        .select('skill_id, rating, skills(name)') // 👈 added skill_id to prevent undefined
        .eq('user_id', userStore.user.id)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching user skills:', error);
        return;
      }

      userSkills.value = data.map((item) => ({
        skill_id: item.skill_id,
        skill_name: item.skills.name,
        rating: item.rating,
      }));
    }

    onMounted(async () => {
      await userStore.fetchUser();
      await fetchUserSkills();
      loading.value = false; // 👈 mark loading as finished
    });

    return { userStore, userSkills, loading }; // 👈 expose loading to the template
  },
};
</script>

<template>
  <div>
    <h1>Welcome, {{ userStore.profile?.first_name || 'Guest' }}</h1>
    <p v-if="userStore.profile">Your Role: {{ userStore.profile.role }}</p>

    <h2>Your Skill Ratings</h2>

    <!-- 👇 loading state -->
    <p v-if="loading">Loading your skills...</p>

    <!-- 👇 only show skills if not loading -->
    <ul v-else>
      <li v-for="rating in userSkills" :key="rating.skill_id">
        <strong>{{ rating.skill_name }}</strong> - Rating: {{ rating.rating }}/5
      </li>
    </ul>
  </div>
</template>
