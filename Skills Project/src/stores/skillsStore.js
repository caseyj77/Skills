import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';

export const useSkillsStore = defineStore('skills', {
  state: () => ({
    skills: [],
    tasks: {},
    loading: false,
  }),

  actions: {
    async fetchSkills() {
      this.loading = true;
      try {
        const { data, error } = await supabase.from('skills').select('*');
        if (error) throw error;
        this.skills = data || [];
      } catch (error) {
        console.error('Error fetching skills:', error);
        this.skills = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchTasks(skill_id) {
      if (this.tasks[skill_id]) return;

      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('skill_id', skill_id);
        if (error) throw error;
        this.tasks[skill_id] = data || [];
      } catch (error) {
        console.error(`Error fetching tasks for skill ${skill_id}:`, error);
        this.tasks[skill_id] = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
