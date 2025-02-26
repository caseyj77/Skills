import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useSkillsStore = defineStore('skills', {
  state: () => ({
    skills: [], // All skills
    tasks: {}, // Tasks grouped by skill_id
    loadingTasks: {}, // Track loading state for each skill
  }),

  actions: {
    async fetchSkills() {
      try {
        const { data, error } = await supabase.from('skills').select('*')
        if (error) throw error
        this.skills = data || [] // Ensure skills is always an array
      } catch (error) {
        console.error('Error fetching skills:', error)
        this.skills = [] // Fallback to an empty array
      }
    },

    async fetchTasks(skill_id) {
      if (this.tasks[skill_id]) return // Skip fetch if already cached

      this.loadingTasks[skill_id] = true

      try {
        const { data, error } = await supabase.from('tasks').select('*').eq('skill_id', skill_id)
        if (error) throw error

        this.tasks[skill_id] = data || [] // Default to an empty array if no tasks
      } catch (error) {
        console.error(`Error fetching tasks for skill ${skill_id}:`, error)
        this.tasks[skill_id] = [] // Fallback to an empty array
      } finally {
        this.loadingTasks[skill_id] = false
      }
    },
  },
})
