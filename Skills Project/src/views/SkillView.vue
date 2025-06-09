// SkillView.vue
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useSkillsStore } from '@/stores/skillsStore'
import { useUserStore } from '@/stores/userStore'
import { useTaskRatingsStore } from '@/stores/taskRatingsStore'
import { supabase } from '@/lib/supabaseClient'
import SideBar from '@/components/SideBar.vue'
import SkillFormPanel from '@/components/SkillFormPanel.vue'
import EmployeeList from '@/components/EmployeeList.vue'

const showSkillPanel = ref(false)
function openAddSkillPanel() {
  showSkillPanel.value = true
}
function closeSkillPanel() {
  showSkillPanel.value = false
}
function handleSkillSave(newSkill) {
  showSkillPanel.value = false
  if (selectedProfession.value) {
    skillsStore.fetchSkillsByProfession(selectedProfession.value)
  }
}

const userStore = useUserStore()
const skillsStore = useSkillsStore()
const taskRatingStore = useTaskRatingsStore()

const userRole = computed(() => (userStore.profile?.role || 'user').toLowerCase())
const isAdmin = computed(() => userRole.value === 'admin')
const isManager = computed(() => userRole.value === 'manager')
const isUser = computed(() => userRole.value === 'user')

const professions = ref([])
const selectedProfession = ref(null)

const fetchProfessions = async () => {
  const { data, error } = await supabase.from('professions').select('*')
  if (error) {
    console.error('Error fetching professions:', error)
    return
  }
  professions.value = data
}

watch(selectedProfession, async (newVal) => {
  if (newVal) {
    await skillsStore.fetchSkillsByProfession(newVal)
  }
})

const userRatings = computed(() =>
  Object.fromEntries(
    Object.entries(taskRatingStore.taskRatings).map(([taskId, rating]) => [
      taskId,
      rating?.self_rating ?? '',
    ])
  )
)

const managerRatings = computed(() =>
  Object.fromEntries(
    Object.entries(taskRatingStore.taskRatings).map(([taskId, rating]) => [
      taskId,
      rating?.manager_rating ?? '—',
    ])
  )
)

async function updateSelfRating(taskId, value) {
  await taskRatingStore.updateRatingForTask(taskId, value)
}

watch(
  () => skillsStore.expandedSkills,
  async (expanded) => {
    const taskIds = expanded.flatMap(skillId =>
      (skillsStore.tasks[skillId] || []).map(task => task.id)
    )

    if (userStore.user?.id && taskIds.length) {
      await taskRatingStore.fetchRatingsForUser(userStore.profile.id)
    }
  },
  { deep: true }
)

onMounted(async () => {
  await userStore.fetchUser() // ✅ Guarantees both user and profile are loaded
  await fetchProfessions()
})

</script>

<template>
  <div class="container">
    <!-- Sidebar Column -->
    <div class="sidebar-column">
      <SideBar :canAddSkill="isAdmin || isManager" @add-skill="openAddSkillPanel" />
    </div>

    <!-- Main Content Column -->
    <div class="main-content">
      <!-- Conditionally show EmployeeList for admins -->
      <EmployeeList v-if="isAdmin" />

      <!-- Skill interface for users and managers -->
      <div v-else>
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

        <main class="main">
          <div class="inner">
            <div v-if="skillsStore.skills.length" class="table-wrapper">
              <h2>Skills for Selected Profession:</h2>
              <ul>
                <li v-for="skill in skillsStore.skills" :key="skill.id" class="skill-row">
                  <h3>{{ skill.name }}</h3>
                  <p>{{ skill.description }}</p>

                  <button class="toggle-btn" @click="skillsStore.toggleSkillTasks(skill.id)">
                    {{ skillsStore.expandedSkills.includes(skill.id) ? 'Hide Tasks' : 'Show Tasks' }}
                  </button>

                  <div v-if="skillsStore.expandedSkills.includes(skill.id)">
                    <table class="task-table">
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Description</th>
                          <th>Self Rating</th>
                          <th>Manager Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="skillsStore.taskLoading[skill.id]">
                          <td colspan="4" class="loading">Loading tasks...</td>
                        </tr>
                        <tr v-for="task in skillsStore.tasks[skill.id]" :key="task.id">
                          <td>{{ task.name }}</td>
                          <td>{{ task.description }}</td>
                          <td>
                            <template v-if="isUser">
                              <input
                                type="number"
                                min="1"
                                max="5"
                                v-model="userRatings[task.id]"
                                @change="updateSelfRating(task.id, userRatings[task.id])"
                              />
                            </template>
                            <template v-else>
                              {{ userRatings[task.id] || '—' }}
                            </template>
                          </td>
                          <td>
                            {{ managerRatings[task.id] ?? '—' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
  </div>

  <SkillFormPanel
    :visible="showSkillPanel"
    @cancel="closeSkillPanel"
    @save="handleSkillSave"
  />

  <p style="margin: 1rem 0; padding: 0.5rem; background: #f0f0f0;">
    Logged in as: <strong>{{ userRole }}</strong>
  </p>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #f3f4f6;
  color: #1f2937;
}

.sidebar-column {
  width: 250px;
  background-color: var(--electric-purple);
  border-right: 1px solid #e5e7eb;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

.toggle-btn {
  color: #7c3aed;
  font-weight: 600;
  cursor: pointer;
  background: none;
  border: none;
  padding: 8px 0;
}

.toggle-btn:hover {
  color: #a21caf;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}

.task-table th,
.task-table td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.loading {
  font-style: italic;
  color: #9ca3af;
  padding: 16px;
}
</style>
