<template>
  <header class="flex items-center justify-between py-4 mx-8 border-b border-gray-300 px-8 bg-transparent">
    <div class="flex items-center">
      <h1 class="text-2xl font-bold text-gray-800 mr-4">{{ title }}</h1>
      <h2 class="text-xl text-gray-600">{{ subtitle }}</h2>
    </div>
    <div class="flex items-center space-x-4">
      <button class="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-full transition duration-200">Login</button>
      <button class="bg-green-500 hover:bg-green-400 text-white py-2 px-4 rounded-full transition duration-200">Sign Up</button>
    </div>
  </header>
</template>

<script>
export default {
  name: "HeaderComponent",
  props: {
    // The title to display in the header
    title: {
      type: String,
      required: true,
    },
    // The subtitle to display beside the title
    subtitle: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>