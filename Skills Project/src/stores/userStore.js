import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
  }),

  actions: {
    async fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      this.user = data.user;
      if (this.user) await this.fetchUserProfile();
    },

    async fetchUserProfile() {
      if (!this.user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .single();
        if (error) throw error;
        this.profile = data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        this.profile = null;
      }
    },

    async signOut() {
      await supabase.auth.signOut();
      this.user = null;
      this.profile = null;
    },
  },
});
