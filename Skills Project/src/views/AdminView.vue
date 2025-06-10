<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/components/layouts/DashboardLayout.vue'
</script>

<template>
  <DashboardLayout>
    <div class="admin-view">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Here you can manage users, skills, and more.</p>
      <!-- Additional admin functionalities can be added here -->
    </div>
  </DashboardLayout>
</template>
