<script setup>

</script>

<template>
<nav class='navbar'>
    <div class="navbar-left">
        <img src="../assets/images/SF Logo.webp" alt='SkillForge logo' class=" logo">
        <span class="brand-name">SkillForge</span>
    </div>
    <div class="navbar-middle">
        Links will go here
    </div>
    <div class="navbar-right">
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
  width: 100%;
  height: 60px; /* Fixed height */
  background-color: #6A596B22; /* Change as needed */
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
  height: 60px; /* Adjust logo size */
  margin-right: 5px;
}

.brand-name {
  font-size: 1rem;
  font-weight: bold;
}

/* Middle section (flex-grow for dynamic width) */
.navbar-middle {
  flex-grow: 1;
  display: flex;
  justify-content: center; /* Center future links */
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
    display: none; /* Hide until links are added */
  }
}

</style>