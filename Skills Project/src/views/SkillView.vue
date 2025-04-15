<script setup>
import Sidebar from '@/components/SideBar.vue';
import { useSkillsStore } from '@/stores/skillsStore';
import { useUserStore } from '@/stores/userStore';
import { onMounted } from 'vue';

const skillsStore = useSkillsStore();
const userStore = useUserStore();

onMounted(async () => {
  await userStore.fetchUser();
  if (userStore.user) {
    skillsStore.fetchSkills();
  }
});

const toggleSkillTasks = skillsStore.toggleSkillTasks;
</script>

<template>
  <div class="flex h-screen bg-gray-100 text-gray-800">

    <Sidebar />

    <!-- Main Content with NavBar -->
    <div class="flex-1 flex flex-col">
      

      <main class="flex-1 overflow-y-auto p-6">
        <div class="max-w-6xl mx-auto">
          <div class="overflow-x-auto rounded-lg shadow-lg bg-white text-gray-800">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Skill</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Category</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="skill in skillsStore.skills" :key="skill.id">
                  <tr class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 font-medium">{{ skill.name }}</td>
                    <td class="px-6 py-4">{{ skill.category || '—' }}</td>
                    <td class="px-6 py-4">
                      <button
                        @click="toggleSkillTasks(skill.id)"
                        class="text-electric-purple hover:text-hot-magenta font-semibold"
                      >
                        {{ skillsStore.expandedSkills.includes(skill.id) ? 'Hide' : 'View' }} Tasks
                      </button>
                    </td>
                  </tr>
                  <tr v-if="skillsStore.expandedSkills.includes(skill.id)">
                    <td colspan="3" class="px-6 py-4 bg-blue-50 text-sm text-gray-700">
                      <div v-if="skillsStore.taskLoading[skill.id]" class="text-gray-500">Loading tasks...</div>
                      <ul v-else class="list-disc pl-6 space-y-1">
                        <li v-for="task in skillsStore.tasks[skill.id]" :key="task.id">
                          {{ task.name }} — {{ task.description }}
                        </li>
                        <li v-if="skillsStore.tasks[skill.id].length === 0" class="italic text-gray-400">
                          No tasks found for this skill.
                        </li>
                      </ul>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>

            <div v-if="skillsStore.loading" class="p-4 text-center text-gray-500">
              Loading skills...
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
