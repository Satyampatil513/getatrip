<template>
    <div class="landing-page min-h-screen flex flex-col items-center bg-light">
      <h1 class="text-[112px] font-bold">Get a Trip</h1>
      <div class="border-t-4 border-black w-full max-w-[calc(100%-56rem)] mb-4"></div>
      <p class="text-xl md:text-[28] mb-4">Find your next best trip!</p>
      <button @click="goToHomePage" class="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-full transition duration-200 mb-4">Let's Get Started</button>
      <p class="text-2xl md:text-[28] mb-4">Where is India Travelling?</p>
      <loading v-if="loading" />
      <SuggestedPlaces v-else :places="suggestedPlaces" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useLocationStore } from '../store/location';
  import SuggestedPlaces from '../components/SuggestedPlaces.vue';
  import Loading from '../components/Loading.vue';
  
  export default {
    components: {
      SuggestedPlaces,
      Loading,
    },
    setup() {
      const router = useRouter();
      const locationStore = useLocationStore();
      const suggestedPlaces = computed(() => locationStore.suggestedPlaces);
      const loading = computed(() => locationStore.loading);
  
      const goToHomePage = () => {
        router.push('/home');
      };
  
      onMounted(() => {
        locationStore.fetchUserLocation();
      });
  
      return {
        goToHomePage,
        suggestedPlaces,
        loading,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>