<script setup>
import { ref, watch, onMounted } from 'vue';
import { useSkillsStore } from '@/stores/skillsStore';
import { useUserStore } from '@/stores/userStore';
import { supabase } from '@/lib/supabaseClient';
import SideBar from '@/components/SideBar.vue';
import SkillFormPanel from '@/components/SkillFormPanel.vue'



const showSkillPanel = ref(false)

function openAddSkillPanel() {
  showSkillPanel.value = true
}

function closeSkillPanel() {
  showSkillPanel.value = false
}

function handleSkillSave(newSkill) {
  // 👇 Later we’ll use adminSkillsStore here to save it
  // For now, just close and refresh the skill list
  showSkillPanel.value = false

  if (selectedProfession.value) {
    skillsStore.fetchSkillsByProfession(selectedProfession.value)
  }
}
const skillsStore = useSkillsStore();
const userStore = useUserStore();

const professions = ref([]);
const selectedProfession = ref(null);

const fetchProfessions = async () => {
  const { data, error } = await supabase.from('professions').select('*');
  if (error) {
    console.error('Error fetching professions:', error);
    return;
  }
  professions.value = data;
};

watch(selectedProfession, async (newVal) => {
  if (newVal) {
    await skillsStore.fetchSkillsByProfession(newVal);
  }
});

onMounted(async () => {
  await fetchProfessions();
});
</script>

<template>
  <div class="container">
    <SideBar @add-skill="openAddSkillPanel"/>

    <div class="main-content">
      <!-- Header Area -->
      <div class="header">
        <div class="dropdown-wrapper">
          <label for="profession">Select Profession:</label>
          <select v-model="selectedProfession" id="profession">
            <option disabled value="">-- Choose a Profession --</option>
            <option v-for="p in professions" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Main Area -->
      <main class="main">
        <div class="inner">
          <div v-if="skillsStore.skills.length" class="table-wrapper">
            <h2>Skills for Selected Profession:</h2>
            <ul>
              <li v-for="skill in skillsStore.skills" :key="skill.id" class="skill-row">
                <h3>{{ skill.name }}</h3>
                <p>{{ skill.description }}</p>
              </li>
            </ul>
          </div>

          <div v-else-if="selectedProfession" class="loading">
            <p>No skills found for this profession.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
  <SkillFormPanel
    :visible="showSkillPanel"
    @cancel="closeSkillPanel"
    @save="handleSkillSave"
  />
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #f3f4f6;
  color: #1f2937;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 16px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.dropdown-wrapper {
  max-width: 300px;
}

.dropdown-wrapper label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 16px;
}

.dropdown-wrapper select {
  width: 100%;
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.main {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.inner {
  max-width: 96rem;
  margin: 0 auto;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.skill-row {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.skill-row:hover {
  background-color: #f9fafb;
  transition: background-color 0.2s ease;
}

.loading {
  text-align: center;
  color: #6b7280;
  padding: 16px;
}
</style>
