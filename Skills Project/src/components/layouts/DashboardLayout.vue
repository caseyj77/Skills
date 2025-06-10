<!-- DashboardLayout.vue -->
<script setup>
import SideBar from '@/components/SideBar.vue'

defineProps({
  canAddSkill: Boolean,
  onAddSkill: Function
})
</script>

<template>
  <div class="container">
    <!-- Sidebar -->
    <div class="sidebar-column">
      <SideBar :canAddSkill="canAddSkill" @add-skill="onAddSkill" />
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <main class="main">
        <div class="inner">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: var(--deep-midnight-blue);
  color: #ffffff;
}

.sidebar-column {
  width: 200px;
  background-color: var(--deep-midnight-blue);
  border-right: 1px solid #e5e7eb;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.inner {
  max-width: 96rem;
  margin: 0 auto;
}
</style>
// This file is a Vue component that serves as a layout for the dashboard.
// It includes a sidebar and a main content area where other components can be rendered.