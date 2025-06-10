<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useUserStore } from '@/stores/userStore'
import { useSkillsStore } from '@/stores/skillsStore'
import { useTaskRatingsStore } from '@/stores/taskRatingsStore'

import DashboardLayout from '@/components/layouts/DashboardLayout.vue'
import SkillMatrix from '@/components/SkillMatrix.vue'

const userStore = useUserStore()
const skillsStore = useSkillsStore()
const taskRatingStore = useTaskRatingsStore()

const professions = ref([])
const selectedProfession = ref(null)
const assignedProfession = ref(null)

const fetchProfessions = async () => {
  const { data, error } = await supabase.from('professions').select('*')
  if (error) {
    console.error('Error fetching professions:', error)
    return
  }
  professions.value = data
}

onMounted(async () => {
  await userStore.fetchUser()
  await fetchProfessions()

  assignedProfession.value = userStore.profile?.primary_profession_id

  if (assignedProfession.value) {
    selectedProfession.value = assignedProfession.value
  }
})
</script>

<template>
  <DashboardLayout>
    <div class="header" v-if="assignedProfession">
      <div class="dropdown-wrapper">
        <p><strong>Profession:</strong>
          {{
            professions.find(p => p.id === assignedProfession)?.name || 'Not Assigned'
          }}
        </p>
      </div>
    </div>

    <SkillMatrix
      v-if="selectedProfession"
      :userId="userStore.profile?.id"
      :professionId="selectedProfession"
      :adminMode="false"
    />

    <div v-else class="loading">
      <p>You do not have a profession assigned. Please contact your administrator.</p>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.header {
  padding: 16px 24px;
  background-color: var(--deep-midnight-blue);
  border-bottom: 1px solid #e5e7eb;
}
.dropdown-wrapper {
  max-width: 300px;
}
.loading {
  font-style: italic;
  color: #9ca3af;
  padding: 16px;
}
</style>
