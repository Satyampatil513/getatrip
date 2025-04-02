<template>
  <div class="w-full space-y-6">
    <!-- Current Value Display -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-700">{{ label }}</h3>
      <span class="text-xl font-bold text-indigo-600">
        ₹{{ value }}
      </span>
    </div>

    <!-- Enhanced Slider -->
    <div class="relative pt-4">
      <input
        type="range"
        class="w-full h-2 bg-gray-200 rounded-full appearance-none slider-track"
        :style="`--value: ${((value - min) / (max - min)) * 100}%`"
        :min="min"
        :max="max"
        :step="step"
        v-model="value"
      />
      
      <!-- Min/Max Labels -->
      <div class="flex justify-between text-sm text-gray-500 mt-2">
        <span>₹{{ min }}</span>
        <span>₹{{ max }}</span>
      </div>
    </div>

    <!-- Transportation Modes Grid -->
    <div class="grid grid-cols-3 gap-4 mt-6">
      <div 
        v-for="(cost, mode) in transportModes" 
        :key="mode"
        class="p-3 bg-indigo-50 rounded-lg border border-indigo-100 transition-all hover:bg-indigo-100/50"
      >
        <p class="text-xs font-medium text-gray-600 uppercase tracking-wide">{{ mode }}</p>
        <p class="text-lg font-semibold text-indigo-600 mt-1">
          {{ (value / cost).toFixed(0) }}<span class="text-sm ml-1">km</span>
        </p>
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
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
    modelValue: {
      type: Number,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      value: this.modelValue || 500, // Default value of 500 Rs
      transportModes: {
        car: 5,    // Rs/km
        plane: 10, // Rs/km
        train: 2,  // Rs/km
      },
    };
  },
  watch: {
    modelValue(newValue) {
      this.value = newValue;
    },
  },
  methods: {
    calculateRadius(budget, mode) {
      const costPerKm = this.transportModes[mode] || 5; // Default to car if mode not found
      return (budget / costPerKm).toFixed(2);
    },
  },
};

  </script>
  
  <style>
  .slider-track {
    background: linear-gradient(
      to right,
      #4f46e5 var(--value),
      #e0e7ff var(--value)
    );
  }
  
  input[type="range"]::-webkit-slider-thumb {
    @apply w-5 h-5 bg-indigo-600 rounded-full shadow-lg;
    transition: transform 0.2s ease;
  }
  
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
  
  input[type="range"]::-moz-range-thumb {
    @apply w-5 h-5 bg-indigo-600 rounded-full shadow-lg;
  }
  </style>