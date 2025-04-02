<template>
    <div class="space-y-1">
      <label v-if="label" class="text-sm font-medium text-gray-600">{{ label }}</label>
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <span class="material-icons-round text-xl">{{ icon }}</span>
    </span>
        <input
          class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-500 bg-white"
          :placeholder="placeholder"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :disabled="disabled"
        />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      icon: {
        type: String,
        default: 'location_on',
        required: true,
      },
      label: {
        type: String,
        required: false,
      },
      placeholder: {
        type: String,
        required: false,
      },
      modelValue: {
        type: [String, Number],
        required: true,
      },
      disabled: {
        type: Boolean,
        required: false,
      },
    },
    emits: ['update:modelValue'],
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>