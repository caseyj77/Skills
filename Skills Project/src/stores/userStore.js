import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
    errorMessage: null, // 👈 Add this
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

    async authUser(email, password) {
      this.loading = true;
      this.errorMessage = null; // clear any old errors

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          this.errorMessage = error.message;
          return;
        }

        this.user = data.user;
        await this.fetchUserProfile(); // load the user's profile after login
      } catch (err) {
        this.errorMessage = 'Unexpected error logging in.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async signOut() {
      await supabase.auth.signOut();
      this.user = null;
      this.profile = null;
    },
  },
});
