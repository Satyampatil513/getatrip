<template>
    <label class="flex items-center space-x-3 cursor-pointer group">
      <div class="relative">
        <input 
          type="checkbox" 
          class="sr-only" 
          :checked="modelValue" 
          @change="$emit('update:modelValue', !modelValue); $emit('change')"
        />
        <div class="w-11 h-6 bg-gray-200 rounded-full shadow-inner transition-colors duration-300 group-hover:bg-gray-300"
             :class="{'bg-blue-500': modelValue, 'hover:bg-blue-600': modelValue}"></div>
        <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300"
             :class="{'translate-x-5': modelValue}"></div>
      </div>
      <span class="text-gray-600 font-medium">Surprise Me!</span>
    </label>
  </template>

  <script>
  export default {
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['update:modelValue', 'change'],
  };

  </script>

  <style scoped>
  /* Add your styles here */
  </style>