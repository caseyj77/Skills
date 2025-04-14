<script setup lang="js">
import { ref, watch } from 'vue'

// Props passed into the component
const props = defineProps({
  visible: Boolean,
  editSkill: {
    type: Object,
    default: null,
  },
})

// Reactive skill object for form binding
const skill = ref({
  name: '',
  description: '',
})

// Watch for changes to editSkill to populate or reset form
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

// Declare the emitted events
const emit = defineEmits(['save', 'cancel'])

// Form submission
function handleSubmit() {
  emit('save', skill.value)
}
</script>

<template>
  <div
    class="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-xl z-50 transition-transform duration-300"
    :class="{ 'translate-x-0': visible, 'translate-x-full': !visible }"
  >
    <div class="flex justify-between items-center px-4 py-3 border-b">
      <h2 class="text-xl font-semibold">
        {{ editSkill ? 'Edit Skill' : 'Add New Skill' }}
      </h2>
      <button @click="emit('cancel')" class="text-gray-500 hover:text-black">
        ✕
      </button>
    </div>

    <form class="p-4 space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700">Skill Name</label>
        <input
          type="text"
          v-model="skill.name"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="skill.description"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          rows="4"
        ></textarea>
      </div>

      <div class="flex justify-end space-x-2">
        <button type="button" @click="emit('cancel')" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save
        </button>
      </div>
    </form>
  </div>
</template>
