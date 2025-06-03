// src/stores/taskRatingsStore.js
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import { useUserStore } from './userStore'

export const useTaskRatingsStore = defineStore('taskRatings', {
  state: () => ({
    taskRatings: {},
    loading: false,
  }),

  actions: {
    async fetchRatingsForUser(profile_id) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('user_task_ratings')
          .select('task_id, self_rating, manager_rating')
          .eq('profile_id', profile_id)

        if (error) throw error

        this.taskRatings = {}
        for (const row of data) {
          this.taskRatings[row.task_id] = {
            self_rating: row.self_rating,
            manager_rating: row.manager_rating,
          }
        }
      } catch (error) {
        console.error('Error fetching user task ratings:', error)
      } finally {
        this.loading = false
      }
    },

    async updateRatingForTask(task_id, self_rating) {
      try {
        const userStore = useUserStore()
        const profileId = userStore.profile?.id
        if (!profileId) throw new Error('User profile not loaded')

        const { error } = await supabase
          .from('user_task_ratings')
          .upsert(
            { profile_id: profileId, task_id, self_rating },
            { onConflict: 'profile_id,task_id' }
          )

        if (error) throw error

        if (!this.taskRatings[task_id]) this.taskRatings[task_id] = {}
        this.taskRatings[task_id].self_rating = self_rating
      } catch (error) {
        console.error('Error updating rating for task:', error)
      }
    },
  },
})
