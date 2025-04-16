import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'

export const useSkillsStore = defineStore('skills', {
  state: () => ({
    skills: [],
    tasks: {},
    taskLoading: {}, // ⬅️ Per-skill loading tracker
    expandedSkills: [], // ⬅️ Tracks which skill rows are expanded
    loading: false,
  }),

  actions: {
    async fetchSkills() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('category', { ascending: true })

        if (error) throw error
        this.skills = data || []
      } catch (error) {
        console.error('Error fetching skills:', error)
        this.skills = []
      } finally {
        this.loading = false
      }
    },

    async fetchTasks(skill_id) {
      // If already fetched, don’t re-fetch
      if (this.tasks[skill_id]) return

      this.taskLoading[skill_id] = true
      try {
        const { data, error } = await supabase.from('tasks').select('*').eq('skill_id', skill_id)

        if (error) throw error
        this.tasks[skill_id] = data || []
      } catch (error) {
        console.error(`Error fetching tasks for skill ${skill_id}:`, error)
        this.tasks[skill_id] = []
      } finally {
        this.taskLoading[skill_id] = false
      }
    },

    toggleSkillTasks(skill_id) {
      const isExpanded = this.expandedSkills.includes(skill_id)
      if (isExpanded) {
        this.expandedSkills = this.expandedSkills.filter((id) => id !== skill_id)
      } else {
        this.expandedSkills.push(skill_id)
        this.fetchTasks(skill_id) // Fetch on demand
      }
    },

    // // 🧪 Placeholder for future use
    // async fetchUserSkills(user_id) {
    //   // To be implemented later for user-specific ratings
    // },

    // async fetchTrainingResources(skill_id) {
    //   // To be implemented later for resource links
    // },

    resetStore() {
      this.skills = []
      this.tasks = {}
      this.taskLoading = {}
      this.expandedSkills = []
      this.loading = false
    },
  },
})
