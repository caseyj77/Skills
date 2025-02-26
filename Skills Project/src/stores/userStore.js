// src/stores/userStore.js
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient' // Adjust the path to your Supabase client

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    companyName: '',
    role: '',
    loading: false, // Optional: to manage loading states
    errorMessage: '', // Optional: to track errors
  }),
  actions: {
    // Initialize user session and fetch profile
    async initializeUser() {
      console.log('Initializing user...')

      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Error retrieving session:', error.message)
        this.errorMessage = 'Error initializing session.'
        return
      }

      if (data.session) {
        console.log('Session found:', data.session)
        const userId = data.session.user.id
        await this.getUserProfile(userId) // Fetch user profile
      } else {
        console.log('No active session found.')
        this.resetUserState() // Clear user state if no session
      }
    },

    // Authenticate user with email and password
    async authUser(email, password) {
      console.log('Authenticating user with email:', email)

      this.$patch({ loading: true, errorMessage: '' })

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Authentication Failed:', error.message)
        this.$patch({
          errorMessage: 'Authentication failed. Please try again.',
          loading: false,
        })
        return
      }

      console.log('User signed in:', data)

      // Update basic user information
      this.$patch({ email: data.user.email })

      // Fetch extended profile details
      await this.getUserProfile(data.user.id)

      // Set loading state to false
      this.$patch({ loading: false })
    },

    // Fetch user profile from Supabase
    async getUserProfile(userId) {
      console.log('Fetching profile for user ID:', userId)

      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, first_name, last_name, phone_number, company_name, role')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error.message)
        this.errorMessage = 'Failed to fetch user profile. Please try again later.'
        return
      }

      if (data) {
        // Update the store's state
        this.$patch({
          userName: data.username,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          phoneNumber: data.phone_number,
          companyName: data.company_name,
          role: data.role,
        })

        console.log('User profile fetched successfully:', data)
      } else {
        console.warn('No profile found for user ID:', userId)
        this.errorMessage = 'Profile not found for the given user ID.'
      }
    },

    // Reset user state
    resetUserState() {
      this.$patch({
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        companyName: '',
        role: '',
        errorMessage: '',
      })
    },

    // Logout user
    async logoutUser() {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Error during logout:', error.message)
        this.errorMessage = 'Logout failed. Please try again.'
        return
      }

      console.log('User logged out successfully.')
      this.resetUserState()
    },
  },
})
