//EmployeeList.vue contains a list of employees with their profiles and skills.

<script setup lang="js">
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRoute } from 'vue-router'


</script>

<template>
    <div>
        <h2>Employees</h2>
        <ul>
            <li v-for="employee in userStore.employees" :key="employee.id">
                <h3>{{ employee.name }}</h3>
                <p>Email: {{ employee.email }}</p>
                <p>Role: {{ employee.role }}</p>
                <p>Skills: {{ employee.skills.join(', ') }}</p>
            </li>
        </ul>
    </div>
</template>