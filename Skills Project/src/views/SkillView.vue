<script>
import { useSkillsStore } from '@/stores/skillsStore';
import { onMounted } from 'vue';

export default {
  setup() {
    const skillsStore = useSkillsStore();

    onMounted(() => {
      skillsStore.fetchSkills();
    });

    return { skillsStore, fetchTasks: skillsStore.fetchTasks };
  },
};
</script>

<template>
  <div>
    <h1>Skills</h1>
    <ul v-if="!skillsStore.loading">
      <li v-for="skill in skillsStore.skills" :key="skill.id">
        <strong>{{ skill.name }}</strong> - {{ skill.category }}
        <button @click="fetchTasks(skill.id)">View Tasks</button>
        <ul v-if="skillsStore.tasks[skill.id]">
          <li v-for="task in skillsStore.tasks[skill.id]" :key="task.id">
            {{ task.name }}
          </li>
        </ul>
      </li>
    </ul>
    <p v-else>Loading...</p>
  </div>
</template>


