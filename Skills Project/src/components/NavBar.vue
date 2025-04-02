<script setup>
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const router = useRouter()

// Check if the user is logged in
const isLoggedIn = computed(() => !!userStore.authUser)

// Handle logout action
const handleLogout = () => {
  userStore.signOut()
  router.push('/')
}
</script>

<template>
  <nav class='navbar'>
    <div class="navbar-left">
      <img src="../assets/images/SF Logo.webp" alt='SkillForge logo' class="logo">
      <span class="brand-name">SkillForge</span>
    </div>

    <div class="navbar-middle">
      <ul class="nav-links">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/skills">Skills</RouterLink></li>
        <li v-if="!isLoggedIn">
          <RouterLink to="/login">Login</RouterLink>
        </li>
        <li v-else>
          <a href="#" @click.prevent="handleLogout">Logout</a>
        </li>
      </ul>
    </div>

    <div class="navbar-right" v-if="isLoggedIn">
      <div class="user-profile">
        <img src="../assets/images/user-avatar.svg" alt="User Avatar" class="avatar">
      </div>
    </div>
  </nav>
</template>

<style lang="css" scoped>
/* Navbar container */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: 60px;
  background-color: #6A596B22;
  color: #00E5FF;
  padding: 0 20px;
  box-sizing: border-box;
}

/* Left section (logo + brand name) */
.navbar-left {
  display: flex;
  align-items: center;
  width: 256px;
}

.logo {
  height: 60px;
  margin-right: 5px;
}

.brand-name {
  font-size: 1rem;
  font-weight: bold;
}

/* Middle section (flex-grow for dynamic width) */
.navbar-middle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
}


/* Navigation links */
.nav-links {
  display: flex;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-links a {
  text-decoration: none;
  color: var(--dusky-blue);
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.3s ease-in-out;
}

.nav-links a:hover {
  background-color: var(--twilight-mist);
  color: white;
}

/* Right section (user profile) */
.navbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 256px;
  background-color: #e9dadd;
}

.user-profile {
  display: flex;
  align-items: center;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    height: auto;
    padding: 10px;
  }
  .navbar-left, .navbar-right {
    width: 100%;
    justify-content: center;
    margin-bottom: 5px;
  }
  .navbar-middle {
    display: none;
  }
}
</style>
