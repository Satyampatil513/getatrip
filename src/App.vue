<template>
  <div class="flex bg-light min-h-screen">
    <!-- Sidebar -->
    <SideBar v-if="isLoggedIn" @toggleSidebar="toggleSidebarState" :isSidebarVisible="isSidebarMinimized" />

    <!-- Main Content -->
    <div :class="[ 'flex-1 ']">
      <!-- Header -->
      <HeaderComponent title="Get a Trip" subtitle="Find your next best Trip!" />

      <!-- Main Content -->
      <main class="flex-grow container mx-auto px-1 py-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import SideBar from './components/SideBar.vue';
import HeaderComponent from './components/HeaderComponent.vue';
import { useAuthStore } from './store/auth';

export default {
  components: {
    SideBar,
    HeaderComponent,
  },
  setup() {
    const isSidebarMinimized = ref(false);
    const authStore = useAuthStore();
    const isLoggedIn = ref(authStore.isLoggedIn);

    const toggleSidebarState = (state) => {
      isSidebarMinimized.value = state;
    };

    return {
      isSidebarMinimized,
      toggleSidebarState,
      isLoggedIn,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */

/* For screens smaller than 1024px, sidebar behaves like a drawer */
@media (max-width: 1024px) {
  .ml-34 {
    margin-left: 0 !important; /* Make sure sidebar doesn't take up space */
  }

  .transition-all {
    transition: none; /* Disable transition on mobile for smoother interaction */
  }
}
</style>