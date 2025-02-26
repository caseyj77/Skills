<script setup lang="js">
import { useUserStore } from '@/stores/userStore'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userLoginData = reactive({
  email: '',
  password: '',
})

const userStore = useUserStore()

async function handleLogin() {
  await userStore.authUser(userLoginData.email, userLoginData.password)
  userLoginData.password = ''
  if (!userStore.errorMessage) {
    router.push('/')
  }
}
</script>

<template>
  <div class="form-container">
    <form @submit.prevent="handleLogin">
      <label for="email">Email</label>
      <input
        v-model="userLoginData.email"
        type="email"
        id="email"
        placeholder="Enter your email"
        required
      />

      <label for="password">Password</label>
      <input
        v-model="userLoginData.password"
        type="password"
        id="password"
        placeholder="Enter your password"
        required
      />

      <div class="button-container">
        <button type="submit" :disabled="userStore.loading">
          <span v-if="userStore.loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </div>
    </form>
    <p v-if="userStore.errorMessage" class="error">{{ userStore.errorMessage }}</p>
  </div>
</template>

<style lang="css" scoped>
/* Form Container */
.form-container {
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--soft-glow);
  border: 1px solid var(--dusky-blue);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Labels */
label {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

/* Input Fields */
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--dusky-blue);
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

/* Button Container */
.button-container {
  display: flex;
  justify-content: center;
}

/* Button Styling */
button {
  background-color: var(--midnight-depth);
  color: var(--soft-glow);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: var(--dusky-blue);
}
</style>
