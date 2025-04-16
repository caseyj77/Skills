import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient'
import { useSkillsStore } from './skillsStore'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
    errorMessage: null,
  }),

  actions: {
    async fetchUser() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !sessionData?.session) {
          console.warn('No active session.')
          this.user = null
          this.profile = null
          return
        }

        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error('Error fetching user:', userError)
          return
        }

        this.user = userData.user
        if (this.user) await this.fetchUserProfile()
      } catch (err) {
        console.error('Unexpected error fetching user:', err)
        this.user = null
        this.profile = null
      }
    },

    async fetchUserProfile() {
      if (!this.user) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .maybeSingle()

        if (error) throw error

        this.profile = data
      } catch (error) {
        console.warn('No matching profile or error fetching profile:', error)
        this.profile = null
      }
    },

    async authUser(email, password) {
      this.loading = true
      this.errorMessage = null

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          this.errorMessage = error.message
          return
        }

        console.log('Login successful! Supabase data:', data)

        this.user = data.user
        await this.fetchUserProfile()
      } catch (err) {
        this.errorMessage = 'Unexpected error logging in.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null

      const skillsStore = useSkillsStore()
      skillsStore.resetStore()
    },
  },
})
