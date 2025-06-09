<script setup>
import { ref, watch, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'

const props = defineProps({
  visible: Boolean,
  editEmployee: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['save', 'cancel'])

const employee = ref({
  username: '',
  first_name: '',
  last_name: '',
  phone_number: '',
  role: '',
  primary_profession_id: '',
})

const professions = ref([])

const fetchProfessions = async () => {
  const { data, error } = await supabase.from('professions').select('*')
  if (error) {
    console.error('Error fetching professions:', error)
    return
  }
  professions.value = data
}

watch(
  () => props.editEmployee,
  (newEmp) => {
    if (newEmp) {
      employee.value = {
        id: newEmp.id,
        username: newEmp.username || '',
        first_name: newEmp.first_name || '',
        last_name: newEmp.last_name || '',
        phone_number: newEmp.phone_number || '',
        role: newEmp.role || '',
        primary_profession_id: newEmp.primary_profession_id || '',
      }
    } else {
      employee.value = {
        username: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        role: '',
        primary_profession_id: '',
      }
    }
  },
  { immediate: true }
)

onMounted(fetchProfessions)

function handleSubmit() {
  emit('save', employee.value)
}
</script>

<template>
  <div class="form-panel" :class="{ visible: visible, hidden: !visible }">
    <div class="form-header">
      <h2>Edit Employee</h2>
      <button @click="emit('cancel')" class="close-btn">✕</button>
    </div>

    <form class="form-body" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Username</label>
        <input type="text" v-model="employee.username" />
      </div>

      <div class="form-group">
        <label>First Name</label>
        <input type="text" v-model="employee.first_name" />
      </div>

      <div class="form-group">
        <label>Last Name</label>
        <input type="text" v-model="employee.last_name" />
      </div>

      <div class="form-group">
        <label>Phone Number</label>
        <input type="text" v-model="employee.phone_number" />
      </div>

      <div class="form-group">
        <label>Role</label>
        <select v-model="employee.role">
          <option disabled value="">-- Select Role --</option>
          <option>User</option>
          <option>Manager</option>
        </select>
      </div>

      <div class="form-group">
        <label>Primary Profession</label>
        <select v-model="employee.primary_profession_id">
          <option disabled value="">-- Select Profession --</option>
          <option v-for="p in professions" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
      </div>

      <div class="form-actions">
        <button type="button" @click="emit('cancel')" class="btn cancel">Cancel</button>
        <button type="submit" class="btn save">Save</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Same styling as SkillFormPanel.vue */
.form-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 420px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  z-index: 50;
  transition: transform 0.3s ease;
  transform: translateX(100%);
}
.form-panel.visible {
  transform: translateX(0%);
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ccc;
}
.form-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #666;
  cursor: pointer;
}
.close-btn:hover {
  color: #000;
}
.form-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}
.btn.cancel {
  background-color: #ddd;
}
.btn.cancel:hover {
  background-color: #ccc;
}
.btn.save {
  background-color: #2563eb;
  color: white;
}
.btn.save:hover {
  background-color: #1d4ed8;
}
</style>
