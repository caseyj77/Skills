<template>
  <div>
    <h1>Welcome, {{ userStore.profile?.first_name || 'Guest' }}</h1>
    <p v-if="userStore.profile">Your Role: {{ userStore.profile.role }}</p>

    <h2>Your Skill Ratings</h2>
    <ul>
      <li v-for="rating in userSkills" :key="rating.skill_id">
        <strong>{{ rating.skill_name }}</strong> - Rating: {{ rating.rating }}/5
      </li>
    </ul>

    <button v-if="userStore.user" @click="userStore.signOut">Sign Out</button>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';
import { supabase } from '@/lib/supabaseClient';

export default {
  setup() {
    const userStore = useUserStore();
    const userSkills = ref([]);

    async function fetchUserSkills() {
      if (!userStore.user) return;

      const { data, error } = await supabase
        .from('user_skills')
        .select('rating, skills(name)')
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
    });

    return { userStore, userSkills };
  },
};
</script>
