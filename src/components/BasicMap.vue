<!-- Map.vue -->
<template>
  <div class="relative bg-white rounded-xl shadow-sm" :class="{'lg:col-span-2': isExpanded}">
    <div ref="mapContainer" class="h-[500px] w-full rounded-xl"></div>
    
    <!-- Map Controls -->
    <div class="absolute bottom-4 right-4 flex flex-col space-y-2">
      <button 
        @click="$emit('toggle-expand')"
        class="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
      >
        <ArrowsPointingOutIcon v-if="!isExpanded" class="w-6 h-6 text-indigo-600" />
        <ArrowsPointingInIcon v-else class="w-6 h-6 text-indigo-600" />
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, watch, ref } from 'vue';
import { useMapStore } from '../store/map';
import { ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/vue/24/outline';

export default {
  props: {
    trip: {
      type: Object,
      required: true
    },
    isExpanded: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const mapContainer = ref(null);
    const mapStore = useMapStore();

    const toggleExpand = () => {
      emit('toggle-expand');
    };

    onMounted(() => {
      mapStore.initializeMap(mapContainer.value, props.trip);
    });

    watch(() => props.trip, (newTrip) => {
      if (mapStore.map) {
        const center = mapStore.calculateCenter(newTrip.nodes);
        mapStore.map.setCenter(center);
        mapStore.addMarkers(newTrip.nodes);
        mapStore.addRoutes(newTrip.edges, newTrip.nodes);
      }
    }, { deep: true });

    onUnmounted(() => {
      mapStore.removeMap();
    });

    return {
      mapContainer,
      toggleExpand
    };
  }
};
</script>

<style scoped>
.marker {
  transition: transform 0.2s ease;
}

.marker:hover {
  transform: scale(1.1);
}

:deep(.mapboxgl-popup-content) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

:deep(.mapboxgl-popup-close-button) {
  font-size: 18px;
  padding: 4px 8px;
  color: #4f46e5;
}
</style>