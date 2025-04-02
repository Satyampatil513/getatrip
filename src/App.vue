<template>
  <div class="flex flex-col min-h-screen bg-light">
    <!-- Sidebar -->
    <SideBar v-if="showSidebar" @toggleSidebar="toggleSidebarState" :isSidebarVisible="isSidebarMinimized" />

    <!-- Main Content -->
    <div :class="['flex flex-col h-screen', showSidebar ? 'lg:pl-24' : '']">
  <!-- Header -->
  <div class="flex-shrink-0">
    <HeaderComponent title="Get a Trip" subtitle="Find your next best Trip!" />
  </div>

  <!-- Main Content -->
  <div class="flex-grow overflow-y-auto">
    <main class="mx-auto rounded-lg shadow-lg m-0">
      <router-view />
    </main>
  </div>
</div>

  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
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
    const route = useRoute();

    const showSidebar = computed(() => {
      return isLoggedIn.value && route.name !== 'LandingPage';
    });

    const toggleSidebarState = (state) => {
      isSidebarMinimized.value = state;
    };

    return {
      isSidebarMinimized,
      toggleSidebarState,
      isLoggedIn,
      showSidebar,
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