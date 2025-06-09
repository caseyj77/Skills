// employeesStore.js 
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useUserStore } from '@/stores/userStore'

export const useEmployeesStore = defineStore('employees', () => {
  const employees = ref([])
  const loading = ref(false)
  const userStore = useUserStore()

 const fetchEmployees = async () => {
  const companyId = userStore.profile?.company_id
  if (!companyId) return

  loading.value = true

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id, username, first_name, last_name, phone_number, role,
      primary_profession_id,
      professions:primary_profession_id (name)
    `)
    .eq('company_id', companyId)
    .neq('role', 'Admin')

//   console.log('Fetching employees for company_id:', companyId)
//   console.log('Result:', data)

  if (error) {
    console.error('Error fetching employees:', error)
  } else {
    employees.value = data
  }

  loading.value = false
}


  // Auto-fetch when userProfile is ready
 watch(
  () => userStore.profile,
  (profile) => {
    if (profile?.company_id) {
      fetchEmployees()
    }
  },
  { immediate: true }
)


  return {
    employees,
    loading,
    fetchEmployees
  }
})
