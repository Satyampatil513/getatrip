<template>
  <div class="w-full space-y-6">
    <h3 class="text-lg font-semibold text-gray-700">{{ label }}</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div 
        v-for="option in options"
        :key="option.value"
        class="relative p-4 border-2 rounded-xl transition-all duration-200 group cursor-pointer"
        :class="[
          selectedOptions.includes(option.value) 
            ? 'border-indigo-600 bg-indigo-50 shadow-inner' 
            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
        ]"
        @click="toggleSelection(option.value)"
      >
        <!-- Checkmark Indicator -->
        <div class="absolute top-1 right-1">
          <span 
            class="material-icons-round text-indigo-600 transition-opacity duration-200"
            :class="selectedOptions.includes(option.value) ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'"
          >
            check_circle
          </span>
        </div>

        <!-- Option Content -->
        <div class="flex items-center justify-center gap-2">
          <span 
            class="text-sm font-medium"
            :class="selectedOptions.includes(option.value) ? 'text-indigo-700' : 'text-gray-600'"
          >
            {{ option.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    selectedOptions: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },
  methods: {
    toggleSelection(value) {
      if (this.selectedOptions.includes(value)) {
        this.selectedOptions = this.selectedOptions.filter((item) => item !== value);
      } else {
        this.selectedOptions = [...this.selectedOptions, value];
      }
    },
  },
};
</script>

<style scoped>
/* Smooth transitions for all properties */
div {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Subtle pulse animation on selection */
@keyframes subtle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.98); }
}

div:active {
  animation: subtle-pulse 0.2s ease;
}
</style>