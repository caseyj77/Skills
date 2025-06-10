<script setup lang="js">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'

const props = defineProps(['employeeId', 'professionId'])

const progress = ref(0)

const calculateProgress = async () => {
  if (!props.professionId) return

  // Step 1: Get all skills in the profession
  const { data: skills, error: skillsError } = await supabase
    .from('skills')
    .select('id')
    .eq('profession_id', props.professionId)

  if (skillsError || !skills?.length) return

  const skillIds = skills.map(s => s.id)

  // Step 2: Get all tasks for those skills
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('id')
    .in('skill_id', skillIds)

  if (tasksError || !tasks?.length) return

  const taskIds = tasks.map(t => t.id)

  // Step 3: Get user_task_ratings for this employee
  const { data: ratings, error: ratingsError } = await supabase
    .from('user_task_ratings')
    .select('task_id, self_rating')
    .eq('profile_id', props.employeeId)
    .in('task_id', taskIds)

  if (ratingsError || !ratings) return

  // Step 4: Calculate % of tasks that have a rating
  const ratedCount = ratings.filter(r => r.self_rating !== null).length
  progress.value = Math.round((ratedCount / taskIds.length) * 100)
}

onMounted(() => {
  calculateProgress()
})
</script>


<template>
  <div class="progress-bar-container">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
    </div>
    <span class="progress-percentage">{{ progress }}%</span>
  </div>
</template>

<style scoped>
.progress-bar-container {
  margin-top: 0.5rem;
}

.progress-bar {
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.progress-percentage {
  display: block;
  text-align: right;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}
</style>
