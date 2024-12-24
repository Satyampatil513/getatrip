<template>
    <div>
      <loading v-if="loading" />
      <div v-else>
        <h1>Dummy Component</h1>
        <p>User Location: {{ userLocation ? `${userLocation.latitude}, ${userLocation.longitude}` : 'None' }}</p>
        <suggested-places :places="suggestedPlaces" />
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, computed } from 'vue';
  import { useLocationStore } from '../store/location';
  import Loading from './Loading.vue';
  import SuggestedPlaces from './SuggestedPlaces.vue';
  
  export default {
    components: {
      Loading,
      SuggestedPlaces,
    },
    setup() {
      const locationStore = useLocationStore();
  
      onMounted(() => {
        locationStore.fetchUserLocation();
      });
  
      const userLocation = computed(() => locationStore.userLocation);
      const suggestedPlaces = computed(() => locationStore.suggestedPlaces);
      const loading = computed(() => locationStore.loading);
  
      return {
        userLocation,
        suggestedPlaces,
        loading,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>