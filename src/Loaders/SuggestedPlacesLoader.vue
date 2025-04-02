<template>
    <div class="loader-page flex flex-wrap gap-6 justify-center items-center p-4">
      <div class="skeleton-box w-[224px] h-[250px] rounded-[32px]"></div>
      <div class="skeleton-box w-[224px] h-[250px] rounded-[32px]"></div>
      <div class="skeleton-box w-[224px] h-[250px] rounded-[32px]"></div>
      <div class="skeleton-box w-[224px] h-[250px] rounded-[32px]"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SuggestedPlacesLoader',
  };
  </script>
  
  <style scoped>
  .loader-page {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
    align-items: center;
    background-color: transparent; /* Make background transparent */
    padding: 16px;
    width: 100%; /* Ensure the width matches the parent container */
  }
  
  .skeleton-box {
    background: linear-gradient(90deg, #2C3E50 25%, #34495E 50%, #2C3E50 75%); /* Darker gradient colors */
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
  </style>