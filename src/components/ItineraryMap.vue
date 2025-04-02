<template>
  <div class="relative h-full">
    <div v-if="loading" class="absolute inset-0 bg-gray-50/80 z-10 flex items-center justify-center rounded-xl">
      <div class="animate-pulse text-indigo-600">
        <span class="material-icons-outlined animate-spin text-4xl">autorenew</span>
      </div>
    </div>
    <div ref="mapContainer" class="map-container h-full w-full rounded-xl shadow-lg border border-gray-100"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import mapboxgl from 'mapbox-gl';

const props = defineProps({
  itinerary: Object,
});

const mapContainer = ref(null);
const loading = ref(true);
let map = null;

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN;

const createCustomMarker = (type) => {
  const marker = document.createElement('div');
  marker.className = 'custom-marker animate-scale-in';
  marker.innerHTML = `
    <div class="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg">
      <span class="material-icons-outlined text-lg">
        ${type === 'Commute' ? 'directions_car' : 'location_on'}
      </span>
    </div>
  `;
  return marker;
};

const initializeMap = async () => {
  try {
    loading.value = true;
    map = new mapboxgl.Map({
      container: mapContainer.value,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [77.5946, 12.9716], // Default center
      zoom: 4,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    const bounds = new mapboxgl.LngLatBounds();
    const coordinatesPromises = [];

    // Process activities
    for (const day of props.itinerary.itinerary) {
      for (const activity of day.activities) {
        if (activity.location) {
          coordinatesPromises.push(
            getCoordinates(activity.location).then(coords => {
              if (coords) {
                bounds.extend(coords);
                new mapboxgl.Marker(createCustomMarker(activity.type))
                  .setLngLat(coords)
                  .setPopup(new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`
                      <div class="p-2 text-sm">
                        <h3 class="font-semibold text-indigo-600">${activity.location}</h3>
                        <p class="text-gray-600 mt-1">${activity.description?.substring(0, 50)}...</p>
                      </div>
                    `))
                  .addTo(map);
              }
              return coords;
            })
          );
        }
      }
    }

    // Wait for all coordinates and draw routes
    const coordinates = (await Promise.all(coordinatesPromises)).filter(c => c);
    if (coordinates.length > 0) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 12 });
    }

    // Add route lines
    for (let i = 0; i < coordinates.length - 1; i++) {
      const directions = await getDirections(coordinates[i], coordinates[i + 1]);
      if (directions) {
        map.addLayer({
          id: `route-${i}`,
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: directions,
              },
            },
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#4f46e5',
            'line-width': 4,
            'line-opacity': 0.7,
          },
        });
      }
    }

  } catch (error) {
    console.error('Map initialization error:', error);
  } finally {
    loading.value = false;
  }
};

/* ... (keep existing getCoordinates and getDirections functions) ... */

// Add resize observer for proper map rendering
onMounted(() => {
  const observer = new ResizeObserver(() => map?.resize());
  if (mapContainer.value) observer.observe(mapContainer.value);
});
</script>

<style scoped>
.custom-marker {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.map-container {
  min-height: 400px;
}

:deep(.mapboxgl-ctrl) {
  margin: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.mapboxgl-popup-content) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e7ff;
}
</style>