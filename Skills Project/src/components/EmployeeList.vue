//EmployeeList.vue contains a list of employees with their profiles and skills.

<script setup>
import { ref } from 'vue'
import { useEmployeesStore } from '@/stores/employeesStore'
import ProgressBar from '@/components/ProgressBar.vue'

const employeesStore = useEmployeesStore()
const expanded = ref({})

const toggleExpand = (id) => {
  expanded.value[id] = !expanded.value[id]
}
</script>

<template>
  <div>
    <h2>Employees</h2>
    <div v-if="employeesStore.loading">Loading employees...</div>

    <div v-else>
      <div
        v-for="emp in employeesStore.employees"
        :key="emp.id"
        class="employee-card"
      >
        <div @click="toggleExpand(emp.id)" class="employee-header">
          ▶ {{ emp.first_name }} {{ emp.last_name }} ({{ emp.role }})
        </div>

        <div v-if="expanded[emp.id]" class="employee-details">
          <p><strong>Username:</strong> {{ emp.username }}</p>
          <p><strong>Phone:</strong> {{ emp.phone_number }}</p>
          <p><strong>Profession:</strong> {{ emp.professions?.name || 'Not Assigned' }}</p>
          <ProgressBar
            :employeeId="emp.id"
            :professionId="emp.primary_profession_id"
          />
          <button>Edit</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.employee-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
}
.employee-header {
  cursor: pointer;
  font-weight: bold;
}
.employee-details {
  margin-top: 0.5rem;
}
</style>