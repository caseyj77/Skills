<script setup>
import Sidebar from '@/components/SideBar.vue'
import { useSkillsStore } from '@/stores/skillsStore'
import { useUserStore } from '@/stores/userStore'
import { onMounted } from 'vue'

const skillsStore = useSkillsStore()
const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchUser()
  if (userStore.user) {
    skillsStore.fetchSkills()
  }
})

const toggleSkillTasks = skillsStore.toggleSkillTasks
</script>

<template>
  <div class="container">
    <Sidebar />

    <div class="main-content">
      <main class="main">
        <div class="inner">
          <div class="table-wrapper">
            <table class="skills-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="skill in skillsStore.skills" :key="skill.id">
                  <tr class="skill-row">
                    <td>{{ skill.name }}</td>
                    <td>{{ skill.category || '—' }}</td>
                    <td>
                      <button
                        @click="toggleSkillTasks(skill.id)"
                        class="toggle-btn"
                      >
                        {{ skillsStore.expandedSkills.includes(skill.id) ? 'Hide' : 'View' }} Tasks
                      </button>
                    </td>
                  </tr>
                  <tr v-if="skillsStore.expandedSkills.includes(skill.id)">
                    <td colspan="3" class="task-row">
                      <div v-if="skillsStore.taskLoading[skill.id]" class="loading">
                        Loading tasks...
                      </div>
                      <ul v-else class="task-list">
                        <li
                          v-for="task in skillsStore.tasks[skill.id]"
                          :key="task.id"
                        >
                          {{ task.name }} — {{ task.description }}
                        </li>
                        <li
                          v-if="skillsStore.tasks[skill.id].length === 0"
                          class="no-tasks"
                        >
                          No tasks found for this skill.
                        </li>
                      </ul>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>

            <div v-if="skillsStore.loading" class="loading-center">
              Loading skills...
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
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

.skills-table {
  width: 100%;
  border-collapse: collapse;
}

.skills-table th,
.skills-table td {
  padding: 16px 24px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.skills-table thead {
  background-color: #f3f4f6;
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
}

.toggle-btn:hover {
  color: #a21caf;
}

.task-row {
  background-color: #eff6ff;
  color: #374151;
  font-size: 14px;
}

.task-list {
  padding-left: 24px;
  list-style: disc;
  margin: 0;
}

.no-tasks {
  font-style: italic;
  color: #9ca3af;
}

.loading,
.loading-center {
  text-align: center;
  color: #6b7280;
  padding: 16px;
}
</style>
