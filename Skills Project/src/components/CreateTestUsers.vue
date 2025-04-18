<script setup>
import { createClient } from '@supabase/supabase-js'

// Temporarily use your service role key here
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
)


const createTestUsers = async () => {
    const { data: user1, error: error1 } = await supabase.auth.admin.createUser({
      email: 'testuser@example.com',
      password: 'Password#1',
      email_confirm: true,
    })
  
    const { data: user2, error: error2 } = await supabase.auth.admin.createUser({
      email: 'testmanager@example.com',
      password: 'Password#1',
      email_confirm: true,
    })
  
    console.log('Test User:', user1, error1)
    console.log('Test Manager:', user2, error2)
  }
  </script>
  
  <template>
    <div class="p-4">
      <button @click="createTestUsers" class="bg-blue-600 text-white px-4 py-2 rounded">
        Create Test Users
      </button>
    </div>
  </template>
