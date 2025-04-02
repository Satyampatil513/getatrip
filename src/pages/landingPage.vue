<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 flex flex-col items-center p-8">
    <!-- Main Content -->
    <div class="flex flex-col items-center flex-grow w-full max-w-6xl">
      <!-- Animated Header Section -->
      <div class="text-center mb-8 animate-fade-in-up">
        <h1 class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-6">
          Your AI Travel Companion ✈️
        </h1>
        <div class="border-t-2 border-indigo-200 w-80 mx-auto mb-6"></div>
        <p class="text-xl md:text-2xl text-gray-600 mb-8">Crafting Perfect Indian Adventures</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 w-full">
        <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-2xl shadow-lg text-center">
          <div class="text-3xl font-bold text-indigo-600 mb-2">{{ stat.value }}+</div>
          <div class="text-gray-600 text-sm">{{ stat.label }}</div>
        </div>
      </div>

      <!-- CTA Section with Illustration -->
      <div class="text-center mb-16 relative w-full">
        <div class="absolute inset-0 flex items-center justify-center opacity-10">
          <GlobeAltIcon class="w-64 h-64 text-indigo-200" />
        </div>
        <button 
          @click="goToFormPage"
          class="relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-8 py-4 rounded-full font-semibold
                transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center mx-auto
                text-lg md:text-xl"
        >
          <SparklesIcon class="w-6 h-6 mr-2" />
          Start Planning Now
        </button>
      </div>

      <!-- Trending Section -->
      <div class="w-full">
        <h2 class="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-8">
          Trending Destinations 🌍
        </h2>
        
        <!-- Featured Card -->
        <div class="mb-12 relative group">
          <div class="bg-white rounded-3xl shadow-xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80" 
              alt="Featured Destination" 
              class="w-full h-64 object-cover"
            >
            <div class="p-8">
              <h3 class="text-2xl font-bold text-gray-800 mb-4">Golden Triangle Special</h3>
              <div class="flex items-center space-x-4 mb-4">
                <span class="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">7 Days</span>
                <span class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">₹25k Budget</span>
              </div>
              <p class="text-gray-600">Experience the iconic trio of Delhi, Agra, and Jaipur with our AI-optimized itinerary</p>
            </div>
          </div>
        </div>

        <!-- Suggested Places Grid -->
        <div class="mb-16">
          <h3 class="text-xl font-semibold text-gray-700 mb-6">Popular Right Now</h3>
          <SuggestedPlacesLoader v-if="loading" />
          <SuggestedPlaces 
            v-else 
            :places="suggestedPlaces"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          />
        </div>

        <!-- Value Proposition Cards -->
        <div class="grid md:grid-cols-3 gap-8 mb-16">
          <div v-for="feature in features" :key="feature.title" class="bg-white p-8 rounded-2xl shadow-lg">
            <component :is="feature.icon" class="w-12 h-12 text-indigo-600 mb-4" />
            <h4 class="text-xl font-semibold text-gray-800 mb-3">{{ feature.title }}</h4>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLocationStore } from '../store/location';
import SuggestedPlaces from '../components/SuggestedPlaces.vue';
import SuggestedPlacesLoader from '../Loaders/SuggestedPlacesLoader.vue';
import { SparklesIcon, GlobeAltIcon, ClockIcon, CurrencyRupeeIcon, MapIcon } from '@heroicons/vue/24/outline';

export default {
  components: {
    SuggestedPlaces,
    SuggestedPlacesLoader,
    SparklesIcon,
    GlobeAltIcon,
    ClockIcon,
    CurrencyRupeeIcon,
    MapIcon
  },
  setup() {
    const router = useRouter();
    const locationStore = useLocationStore();
    const suggestedPlaces = computed(() => locationStore.suggestedPlaces);
    const loading = computed(() => locationStore.loading);

    const stats = ref([
      { value: '50K', label: 'Trips Planned' },
      { value: '95%', label: 'Satisfaction Rate' },
      { value: '150', label: 'Destinations' },
      { value: '10M', label: 'Itinerary Combinations' }
    ]);

    const features = ref([
      {
        icon: 'ClockIcon',
        title: "Smart Time Optimization",
        description: "AI-powered scheduling maximizes your experience while minimizing travel time"
      },
      {
        icon: 'CurrencyRupeeIcon',
        title: "Budget Management",
        description: "Real-time cost tracking and smart budget allocation for every aspect of your trip"
      },
      {
        icon: 'MapIcon',
        title: "Dynamic Routing",
        description: "Weather-aware and crowd-adjusted itinerary planning for seamless travel"
      }
    ]);

    const goToFormPage = () => {
      router.push('/form');
    };

    onMounted(async () => {
      await locationStore.fetchUserLocation();
    });

    return {
      goToFormPage,
      suggestedPlaces,
      loading,
      stats,
      features
    };
  },
};
</script>

<style>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group:hover .group-hover\:scale-102 {
  transform: scale(1.02);
}

.gradient-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #4f46e5 50%, transparent 100%);
}
</style>