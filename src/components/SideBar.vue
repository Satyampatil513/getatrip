<template>
  <aside
    :class="[ 
      'flex flex-col bg-dark text-light overflow-hidden min-h-screen p-4 transition-all duration-200 ease-in-out max-lg:absolute max-lg:z-50',
      is_expanded ? 'w-sidebar-width' : 'w-[calc(2rem+32px)]' 
    ]"
  >
    <div class="logo">
      <img :src="logoURL" alt="Vue" />
    </div>

    <div
      class="menu-toggle-wrap flex justify-end mb-4 relative top-0 transition-all duration-200"
      :class="is_expanded ? '-top-12' : ''"
    >
      <button
        class="menu-toggle transition-all duration-200"
        @click="ToggleMenu"
      >
        <span
          class="material-icons text-2xl text-light transition-all duration-200"
          :class="is_expanded ? 'rotate-180' : ''"
        >
          expand_more
        </span>
      </button>
    </div>

    <!-- Add your sidebar content here -->
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <!-- Add more links as needed -->
      </ul>
    </nav>
  </aside>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth'; // Assuming you have an auth store

export default {
  props: {
    isSidebarVisible: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const is_expanded = ref(false);
    const authStore = useAuthStore();
    const isLoggedIn = ref(authStore.isLoggedIn);

    const ToggleMenu = () => {
      is_expanded.value = !is_expanded.value;
    };

    return {
      is_expanded,
      ToggleMenu,
      isLoggedIn,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>