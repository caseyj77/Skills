<script setup>
import { supabase } from '@/lib/supabaseClient'

async function createTestUsers() {
  try {
    const { data: user1, error: error1 } = await supabase.auth.admin.createUser({
      email: 'testuser@example.com',
      password: 'password123',
      email_confirm: true,
    })

    const { data: user2, error: error2 } = await supabase.auth.admin.createUser({
      email: 'testmanager@example.com',
      password: 'password123',
      email_confirm: true,
    })

    if (error1 || error2) {
      console.error('Error creating users:', error1 || error2)
      return
    }

    // Optional: Replace with real UUIDs from your professions table
    const defaultProfessionId = '00000000-0000-0000-0000-000000000000'

    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: user1.user.id,
        username: 'testuser',
        role: 'User',
        primary_profession_id: defaultProfessionId,
      },
      {
        id: user2.user.id,
        username: 'testmanager',
        role: 'Manager',
        primary_profession_id: defaultProfessionId,
      },
    ])

    if (profileError) {
      console.error('Error inserting profiles:', profileError)
    } else {
      console.log('Test users and profiles created successfully.')
    }
  } catch (err) {
    console.error('Unexpected error creating test users:', err)
  }
}
</script>

<template>
  <div>
    <h2>Create Test Users</h2>
    <button @click="createTestUsers">Create Users</button>
  </div>
</template>