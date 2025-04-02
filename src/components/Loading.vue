<!-- Loading Component -->
<template>
  <div class="flex flex-col items-center justify-center min-h-[200px] space-y-4">
    <div class="relative">
      <div class="w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
      <div class="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p class="text-indigo-600 font-semibold animate-pulse">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    text : {
      type: String,
      default: 'Crafting your perfect experience...'
    }
  }
};
</script>

<style scoped>
</style>