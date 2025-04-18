<script setup>
import NavBar from './components/NavBar.vue'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.fetchUser()
})
</script>

<template>
  <NavBar />
  <RouterView />
</template>

<style></style>
