<template>
  <div class="itinerary-page p-4 flex">
    <div class="itinerary-column flex-1 overflow-y-auto pr-4">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-4">{{ itinerary.title }}</h1>
        <p class="text-gray-600 mb-4">{{ itinerary.overview }}</p>
        <div class="flex justify-center gap-4 text-sm text-gray-600">
          <span class="flex items-center">
            <span class="material-symbols-outlined mr-1">payments</span>
            {{ itinerary.totalCost }}
          </span>
          <span class="flex items-center">
            <span class="material-symbols-outlined mr-1">calendar_today</span>
            Best time: {{ itinerary.bestTimeToVisit }}
          </span>
          <span class="flex items-center">
            <span class="material-symbols-outlined mr-1">trending_up</span>
            {{ itinerary.difficultyLevel }}
          </span>
        </div>
      </div>

      <div v-if="loading" class="text-xl text-center">Loading...</div>
      <div v-else-if="error" class="text-xl text-red-500 text-center">{{ error }}</div>
      <div v-else>
        <div v-for="(activities, dayKey) in itinerary.itinerary" :key="dayKey" class="day-section mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-center">{{ dayKey }}</h2>
          <div class="timeline">
            <div v-for="activity in activities" :key="activity.start_time" class="timeline-item animate-fade-in">
              <div class="timeline-icon">
                <span class="material-symbols-outlined">
                  {{ activity.type === 'Commute' ? 'directions_car' : 'location_on' }}
                </span>
              </div>
              <div class="timeline-content">
                <h3 class="activity-title">
                  {{ activity.type === 'Commute' 
                    ? `Travel from ${activity.start_location} to ${activity.end_location}`
                    : activity.location }}
                </h3>
                <p class="activity-time">{{ formatTime(activity.start_time) }} - {{ formatTime(activity.end_time) }}</p>
                <p class="activity-description text-gray-700 mb-3">{{ activity.description }}</p>
                
                <div class="activity-details">
                  <div v-if="activity.type === 'Commute'" class="mb-2">
                    <p class="flex items-center mb-1">
                      <span class="material-symbols-outlined mr-1">directions_car</span>
                      Mode: {{ activity.mode }}
                    </p>
                    <p class="flex items-center mb-1">
                      <span class="material-symbols-outlined mr-1">straight</span>
                      Distance: {{ activity.distance }}
                    </p>
                    <p class="flex items-center mb-1">
                      <span class="material-symbols-outlined mr-1">schedule</span>
                      Duration: {{ activity.duration }}
                    </p>
                  </div>
                  <div v-else class="mb-2">
                    <p class="flex items-center mb-1">
                      <span class="material-symbols-outlined mr-1">location_on</span>
                      Coordinates: {{ activity.latitude }}, {{ activity.longitude }}
                    </p>
                  </div>
                  
                  <div class="flex items-center mb-2">
                    <span class="material-symbols-outlined mr-1">payments</span>
                    Cost: {{ activity.estimatedCost }}
                  </div>
                  
                  <div class="flex items-center mb-2">
                    <span class="material-symbols-outlined mr-1">wb_sunny</span>
                    Weather: {{ activity.weather }}
                  </div>
                  
                  <div class="tips-section mt-3 p-2 bg-blue-50 rounded">
                    <p class="flex items-center mb-1">
                      <span class="material-symbols-outlined mr-1">lightbulb</span>
                      <span class="font-medium">Tips:</span>
                    </p>
                    <p class="text-sm text-gray-700">{{ activity.tips }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="map-column w-2/5">
      <ItineraryMap :itinerary="itinerary" />
    </div>
  </div>
</template>

<script setup>
import { useItineraryStore } from '../store/itinerary';
import { onMounted } from 'vue';
import ItineraryMap from '../components/ItineraryMap.vue';

const itineraryStore = useItineraryStore();
const { itinerary, loading, error } = itineraryStore;

const formatTime = (timeString) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

onMounted(() => {
  // Fetch the itinerary if not already fetched
  if (!itinerary) {
    itineraryStore.generateItinerary();
  }
});
</script>

<style scoped>
.itinerary-page {
  display: flex;
  height: 100vh;
}

.itinerary-column {
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
}

.map-column {
  width: 60%;
  position: sticky;
  top: 0;
  height: 100vh;
}

.day-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.timeline {
  position: relative;
  padding: 20px 0;
  margin-left: 20px;
  border-left: 2px solid #ddd;
}

.timeline-item {
  position: relative;
  margin-bottom: 20px;
  padding-left: 20px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-icon {
  position: absolute;
  left: -30px;
  top: 0;
  background-color: #fff;
  border: 2px solid #4CAF50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #4CAF50;
}

.timeline-content {
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.activity-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
}

.activity-details {
  font-size: 1rem;
  color: #333;
}

.animate-fade-in {
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.map-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.tips-section {
  border-left: 3px solid #4CAF50;
}

.material-symbols-outlined {
  font-size: 20px;
  color: #4CAF50;
}

.activity-description {
  font-size: 1.1rem;
  line-height: 1.5;
}
</style>