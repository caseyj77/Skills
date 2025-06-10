// SkillTable.vue
<script setup>
import { useSkillsStore } from '@/stores/skillsStore'
import { onMounted, reactive } from 'vue'

const skillsStore = useSkillsStore()
const expandedSkills = reactive({}) // Using reactive instead of ref

onMounted(() => {
  if (!skillsStore.skills.length) {
    skillsStore.fetchSkills()
  }
})

const toggleSkill = (skill_id) => {
  expandedSkills[skill_id] = !expandedSkills[skill_id]

  if (expandedSkills[skill_id] && !skillsStore.tasks[skill_id]) {
    skillsStore.fetchTasks(skill_id)
  }
}
</script>

<template>
  <div id="skill-table" class="container">
    <!-- Loading state -->
    <div v-if="skillsStore.loading" class="loading">Loading skills...</div>

    <!-- Render skills table -->
    <table v-else id="skills">
      <thead>
        <tr>
          <th></th>
          <th>Skill Name</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="skill in skillsStore.skills" :key="skill.skill_id">
          <!-- Skill Row -->
          <tr class="skill-row">
            <td>
              <button
                class="expand-button"
                @click="toggleSkill(skill.skill_id)"
                :aria-label="expandedSkills[skill.skill_id] ? 'Collapse' : 'Expand'"
                :disabled="skillsStore.loadingTasks[skill.skill_id]"
              >
                {{ expandedSkills[skill.skill_id] ? '-' : '+' }}
              </button>
            </td>
            <td>{{ skill.name }}</td>
            <td>{{ skill.category || 'N/A' }}</td>
          </tr>

          <!-- Task Rows -->
          <template v-if="expandedSkills[skill.skill_id]">
            <tr
              v-for="task in skillsStore.tasks[skill.skill_id] || []"
              :key="task.task_id"
              class="task-row"
            >
              <td></td>
              <td colspan="2">
                <strong>{{ task.name }}:</strong> {{ task.details }}
              </td>
            </tr>

            <!-- No Tasks Row -->
            <tr v-if="!skillsStore.tasks[skill.skill_id]?.length" class="no-tasks-row">
              <td></td>
              <td colspan="2">No tasks available for this skill.</td>
            </tr>

            <!-- Loading Tasks Row -->
            <tr v-if="skillsStore.loadingTasks[skill.skill_id]" class="loading-tasks-row">
              <td></td>
              <td colspan="2">Loading tasks...</td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Container styling */
.container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background: var(--deep-midnight-blue);
  border-radius: 8px;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--soft-glow-gray);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Table styling */
#skills {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 0.95rem;
  background: var(--deep-midnight-blue);
  color: var(--soft-glow-gray);
}

/* Header styling */
#skills thead th {
  text-align: left;
  padding: 12px;
  background: var(--steel-blue);
  color: var(--soft-glow-gray);
  font-weight: bold;
  border-bottom: 2px solid var(--charcoal-black);
}

/* Skill Row */
.skill-row {
  background: var(--dark-violet);
  transition: background-color 0.3s ease;
}

.skill-row:nth-child(even) {
  background: var(--steel-blue);
}

.skill-row:hover {
  background: var(--hot-magenta);
  cursor: pointer;
}

/* Task Row */
.task-row {
  background: var(--muted-indigo);
  color: var(--soft-glow-gray);
}

.task-row td {
  padding: 12px 16px;
  border-top: 1px solid var(--steel-blue);
}

/* Expand Button */
.expand-button {
  cursor: pointer;
  background: var(--electric-purple);
  border: 1px solid var(--charcoal-black);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 1rem;
  color: var(--soft-glow-gray);
  transition: background 0.2s;
}

.expand-button:hover {
  background: var(--hot-magenta);
}

.expand-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive styling */
@media (max-width: 768px) {
  #skills {
    font-size: 0.85rem;
  }
}
</style>
