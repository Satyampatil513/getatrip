<template>
    <div class="loading">
      <p>Loading...</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Loading',
  };
  </script>
  
  <style scoped>
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.5rem;
    color: #000000;
  }
  </style>