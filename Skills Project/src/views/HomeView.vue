<script setup lang="js">
import { useUserStore } from '@/stores/userStore'

// Access the user store
const userStore = useUserStore()
</script>

<template>
  <div class="home-container">
    <p>Welcome to the Home Page, {{ userStore.userName || 'Guest' }}</p>
  </div>
</template>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 20px;
}
</style>
