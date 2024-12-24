<template>
    <div class="trip-card">
      <!-- Display trip details here -->
      <h3>{{ trip.name }}</h3>
      <p>{{ trip.description }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      trip: {
        type: Object,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>