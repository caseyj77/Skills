<script setup lang="js">
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  visible: Boolean,
  editSkill: {
    type: Object,
    default: null,
  },
})

const skill = ref({
  name: '',
  description: '',
})

watch(
  () => props.editSkill,
  (newSkill) => {
    if (newSkill) {
      skill.value = {
        name: newSkill.name || '',
        description: newSkill.description || '',
      }
    } else {
      skill.value = { name: '', description: '' }
    }
  },
  { immediate: true }
)

const emit = defineEmits(['save', 'cancel'])

function handleSubmit() {
  emit('save', skill.value)
}
</script>

<template>
  <div
    class="form-panel"
    :class="{ 'visible': visible, 'hidden': !visible }"
  >
    <div class="form-header">
      <h2>{{ editSkill ? 'Edit Skill' : 'Add New Skill' }}</h2>
      <button @click="emit('cancel')" class="close-btn">✕</button>
    </div>

    <form class="form-body" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Skill Name</label>
        <input type="text" v-model="skill.name" />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="skill.description" rows="4"></textarea>
      </div>

      <div class="form-actions">
        <button type="button" @click="emit('cancel')" class="btn cancel">Cancel</button>
        <button type="submit" class="btn save">Save</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
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
.form-group textarea {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  resize: vertical;
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
