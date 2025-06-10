<script setup>
import { ref } from 'vue'
import { useEmployeesStore } from '@/stores/employeesStore'
import DashboardLayout from '@/components/layouts/DashboardLayout.vue'
import SkillMatrix from '@/components/SkillMatrix.vue'
import EmployeeEditFormPanel from '@/components/EmployeeEditFormPanel.vue'

const employeesStore = useEmployeesStore()
const expanded = ref({})
const showEditPanel = ref(false)
const editEmployee = ref(null)

const toggleExpand = (id) => {
  expanded.value[id] = !expanded.value[id]
}

const startEdit = (employee) => {
  editEmployee.value = employee
  showEditPanel.value = true
}

const closeEditPanel = () => {
  showEditPanel.value = false
  editEmployee.value = null
}

const saveEmployee = async (employee) => {
  const success = await employeesStore.editEmployee(employee)
  if (success) closeEditPanel()
}
</script>

<template>
  <DashboardLayout>
    <div class="admin-panel">
      <h2>Admin Panel - Employees</h2>
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

            <SkillMatrix
              :userId="emp.id"
              :professionId="emp.primary_profession_id"
              :adminMode="true"
            />

            <button @click="startEdit(emp)">Edit</button>
          </div>
        </div>
      </div>

      <!-- Edit Side Panel -->
      <EmployeeEditFormPanel
        :visible="showEditPanel"
        :editEmployee="editEmployee"
        @save="saveEmployee"
        @cancel="closeEditPanel"
      />
    </div>
  </DashboardLayout>
</template>

<style scoped>
.admin-panel {
  padding: 16px;
}

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
