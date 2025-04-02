<template>
  <div class="bg-gray-800 rounded-lg shadow-lg p-6 text-white w-full animate-fadeIn mb-6">
    <h2 class="text-3xl font-bold mb-4 text-white text-center">{{ trip.title }}</h2>
    <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <div class="flex-1 space-y-4">
        <div v-for="(edge, index) in trip.edges" :key="index" class="flex items-center justify-between bg-gray-900 rounded-md p-3 shadow-sm">
          <div class="flex-1 text-center">
            <span class="font-semibold">{{ edge.from }}</span>
          </div>
          <font-awesome-icon icon="arrow-right" class="text-yellow-400 mx-2" />
          <div class="flex-1 text-center">
            <span class="font-semibold">{{ edge.to }}</span>
          </div>
          <div class="flex flex-col text-sm text-gray-400 ml-4">
            <span>{{ edge.mode }}</span>
            <span>{{ edge.distance }}</span>
            <span>{{ edge.duration }}</span>
          </div>
        </div>
      </div>
      <div id="map-cyclic" class="map-container h-64 w-full md:w-1/2 rounded-lg"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue';
import mapboxgl from 'mapbox-gl';
import type { Trip } from '../types/trips';

const props = defineProps<{
  trip: Trip;
}>();

let map: mapboxgl.Map | null = null;
const mapContainerId = `map-cyclic`;

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;

const calculateBounds = (nodes: Trip['nodes']) => {
  const coordinates = Object.values(nodes).map(node => [node.longitude, node.latitude]);
  const bounds = coordinates.reduce(
    (bounds, coord) => bounds.extend(coord as [number, number]), 
    new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
  );
  return bounds;
};

const addMarkers = () => {
  if (!map) return;
  
  // Clear existing markers
  const markers = document.getElementsByClassName('marker');
  while (markers[0]) {
    markers[0].remove();
  }

  // Add markers for each location
  Object.entries(props.trip.nodes).forEach(([name, location]) => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundColor = '#4CAF50';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid white';
    
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(`
        <h3>${name}</h3>
        <p><strong>Things to do:</strong></p>
        <ul>
          ${location.thingsToDo.map(thing => `<li>${thing}</li>`).join('')}
        </ul>
      `);

    new mapboxgl.Marker(el)
      .setLngLat([location.longitude, location.latitude])
      .setPopup(popup)
      .addTo(map);
  });
};

onMounted(() => {
  const bounds = calculateBounds(props.trip.nodes);
  
  map = new mapboxgl.Map({
    container: mapContainerId,
    style: 'mapbox://styles/mapbox/streets-v11',
    bounds: bounds,
    padding: 50
  });

  map.on('load', () => {
    addMarkers();
  });
});

watch(() => props.trip, (newTrip) => {
  if (!map) return;
  
  const bounds = calculateBounds(newTrip.nodes);
  map.fitBounds(bounds, { padding: 50 });
  addMarkers();
}, { deep: true });

onUnmounted(() => {
  map?.remove();
});
</script>

<style scoped>
.map-container {
  height: 100%;
  width: 100%;
}
.marker {
  background-color: #4CAF50;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
}
</style>