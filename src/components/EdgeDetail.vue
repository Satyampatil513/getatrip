<template>
  <div class="edge-card group relative p-5 bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-gray-100">
    <div class="flex items-start gap-4">
      <!-- Transport Icon with Gradient Background -->
      <div class="p-2.5 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-lg shadow-sm">
        <TransportIcon :mode="edge.mode" class="w-6 h-6 text-white" />
      </div>

      <!-- Route Details -->
      <div class="flex-1 min-w-0 space-y-2">
        <div class="flex items-center gap-3">
          <h3 class="text-base font-semibold text-indigo-600 truncate">{{ edge.from }}</h3>
          <ArrowRightIcon class="w-4 h-4 text-gray-400 flex-shrink-0" />
          <h3 class="text-base font-semibold text-indigo-600 truncate">{{ edge.to }}</h3>
        </div>

        <!-- Meta Information -->
        <div class="flex items-center gap-4 text-sm text-gray-600">
          <div class="flex items-center gap-1.5">
            <ClockIcon class="w-4 h-4 text-blue-500" />
            <span>{{ edge.duration }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <MapPinIcon class="w-4 h-4 text-purple-500" />
            <span>{{ edge.distance }}</span>
          </div>
        </div>
      </div>

      <!-- Chevron Indicator -->
      <ChevronRightIcon class="w-5 h-5 text-gray-400 mt-1.5 group-hover:text-indigo-600 transition-colors" />
    </div>
  </div>
</template>

<script>
import { ClockIcon, MapPinIcon, ChevronRightIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import TransportIcon from './TransportIcon.vue'

export default {
  components: {
    ClockIcon,
    MapPinIcon,
    ChevronRightIcon,
    ArrowRightIcon,
    TransportIcon
  },
  props: {
    edge: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.edge-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.edge-card:hover {
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.1), 0 4px 6px -4px rgba(79, 70, 229, 0.1);
}
</style>