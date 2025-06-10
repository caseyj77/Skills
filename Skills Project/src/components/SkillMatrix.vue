<script setup>
import { ref, watch, computed } from 'vue'
import { useSkillsStore } from '@/stores/skillsStore'
import { useTaskRatingsStore } from '@/stores/taskRatingsStore'

const props = defineProps({
  userId: {},
  professionId: {},
  adminMode: { default: false }
})

const skillsStore = useSkillsStore()
const taskRatingStore = useTaskRatingsStore()

const expandedSkills = ref([])

const toggleSkill = async (skillId) => {
  const isExpanded = expandedSkills.value.includes(skillId)

  if (isExpanded) {
    expandedSkills.value = expandedSkills.value.filter(id => id !== skillId)
  } else {
    expandedSkills.value.push(skillId)
    if (!skillsStore.tasks[skillId]) {
      await skillsStore.fetchTasks(skillId)
    }
  }
}

const userRatings = computed(() =>
  Object.fromEntries(
    Object.entries(taskRatingStore.taskRatings).map(([taskId, rating]) => [
      taskId,
      rating?.self_rating ?? ''
    ])
  )
)

const managerRatings = computed(() =>
  Object.fromEntries(
    Object.entries(taskRatingStore.taskRatings).map(([taskId, rating]) => [
      taskId,
      rating?.manager_rating ?? '—'
    ])
  )
)

const updateSelfRating = async (taskId, value) => {
  if (!props.adminMode) {
    await taskRatingStore.updateRatingForTask(taskId, value)
  }
}

watch(
  () => [props.professionId, props.userId],
  async ([professionId, userId]) => {
    if (professionId && userId) {
      await skillsStore.fetchSkillsByProfession(professionId)
      await taskRatingStore.fetchRatingsForUser(userId)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="skill-matrix">
    <div v-if="skillsStore.loading">Loading skills...</div>

    <div v-else-if="skillsStore.skills.length">
      <ul>
        <li v-for="skill in skillsStore.skills" :key="skill.id" class="skill-row">
          <h3>{{ skill.name }}</h3>
          <p>{{ skill.description }}</p>

          <button class="toggle-btn" @click="toggleSkill(skill.id)">
            {{ expandedSkills.includes(skill.id) ? 'Hide Tasks' : 'Show Tasks' }}
          </button>

          <div v-if="expandedSkills.includes(skill.id)">
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
                <tr
                  v-for="task in skillsStore.tasks[skill.id] || []"
                  :key="task.id"
                >
                  <td>{{ task.name }}</td>
                  <td>{{ task.description }}</td>
                  <td>
                    <template v-if="adminMode">
                      {{ userRatings[task.id] || '—' }}
                    </template>
                    <template v-else>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        v-model="userRatings[task.id]"
                        @change="updateSelfRating(task.id, userRatings[task.id])"
                      />
                    </template>
                  </td>
                  <td>{{ managerRatings[task.id] ?? '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </li>
      </ul>
    </div>

    <div v-else>
      <p>No skills found for this profession.</p>
    </div>
  </div>
</template>

<style scoped>
.skill-matrix {
  padding: 1rem;
}

.skill-row {
  padding: 1rem;
  border-bottom: 1px solid #ccc;
}

.toggle-btn {
  margin-top: 0.5rem;
  background-color: #7c3aed;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.task-table {
  width: 100%;
  margin-top: 0.5rem;
  border-collapse: collapse;
}

.task-table th,
.task-table td {
  padding: 8px;
  border: 1px solid #ddd;
}

.loading {
  font-style: italic;
  color: gray;
}
</style>
