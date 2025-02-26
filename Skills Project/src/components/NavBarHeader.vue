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
nav {
  background-color: #f8f9fa;
  padding: 10px;
  
}

ul {
  display: flex;
  gap: 10px;
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
  color: #333;
  font-weight: bold;
}

a:hover {
  color: #007bff;
}
</style>
