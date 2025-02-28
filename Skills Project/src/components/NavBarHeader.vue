<script setup lang="js">
</script>

<template>
  <nav>
    <ul>
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/skills">Skills</RouterLink></li>
      <li><RouterLink to="/login">Login</RouterLink></li>
    </ul>
  </nav>
</template>

<style scoped>
/* Navigation Bar */
nav {
  background-color: var(--charcoal-black);
  padding: 10px;
}

ul {
  display: flex;
  gap: 15px;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: flex-end;
}

li {
  padding: 5px 10px;
  border-radius: 5px;
}

a {
  text-decoration: none;
  color: var(--soft-glow-gray);
  font-weight: bold;
  transition: color 0.3s;
}

a:hover {
  color: var(--neon-cyan);
}
</style>
