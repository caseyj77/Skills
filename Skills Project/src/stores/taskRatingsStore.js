// src/stores/taskRatingsStore.js
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';

export const useTaskRatingsStore = defineStore('taskRatings', {
  state: () => ({
    taskRatings: {},
    loading: false,
  }),

  actions: {
    async fetchRatingsForUser(user_id) {
      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('user_task_ratings')
          .select('task_id, rating')
          .eq('user_id', user_id);

        if (error) throw error;

        // Store as { task_id: rating }
        this.taskRatings = {};
        for (const row of data) {
          this.taskRatings[row.task_id] = row.rating;
        }

      } catch (error) {
        console.error('Error fetching user task ratings:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateRatingForTask(task_id, rating) {
      try {
        // Always fetch the current authenticated user from Supabase
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) throw userError || new Error('User not authenticated')
    
        const { error } = await supabase
          .from('user_task_ratings')
          .upsert(
            { user_id: user.id, task_id, rating },
            { onConflict: 'user_id,task_id' }
          )
    
        if (error) throw error
    
        this.taskRatings[task_id] = rating
      } catch (error) {
        console.error('Error updating rating for task:', error)
      }
    }
    
  },
    
});
