<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 flex flex-col items-center p-4 lg:p-8">
    <!-- Header -->
    <div class="w-full max-w-6xl mb-6">
      <div class="text-center">
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-2">
          Your Travel Plans ✈️
        </h1>
        <p class="text-gray-600 text-lg">{{ trips.length }} curated experiences found</p>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="w-full max-w-6xl flex-grow flex flex-col">
      <div v-if="loading" class="flex justify-center">
        <Loading :text="loadingMessage"/>
      </div>

      <div v-else class="bg-white rounded-3xl shadow-xl overflow-hidden flex-grow flex flex-col">
        <!-- Top Controls -->
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button 
              @click="toggleMapExpansion"
              class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowsPointingOutIcon v-if="!isMapExpanded" class="w-5 h-5 text-indigo-600" />
              <ArrowsPointingInIcon v-else class="w-5 h-5 text-indigo-600" />
            </button>
            <button 
              @click="generateItinerary"
              class="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-2 rounded-full
                     flex items-center space-x-2 hover:scale-105 transition-transform text-sm"
            >
              <SparklesIcon class="w-4 h-4" />
              <span>Generate Itinerary</span>
            </button>
          </div>

          <!-- Centered Navigation Controls -->
          <div class="flex items-center space-x-3">
            <button 
              @click="prevTrip" 
              :disabled="currentTripIndex === 0"
              class="bg-gradient-to-r from-indigo-600 to-blue-500 text-white w-10 h-10 rounded-full 
                     flex items-center justify-center transform transition-all hover:scale-105
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeftIcon class="w-5 h-5" />
            </button>

            <div class="flex space-x-1">
              <button 
                v-for="(_, index) in trips"
                :key="index"
                @click="goToTrip(index)"
                :class="[
                  'w-10 h-10 rounded-full font-semibold transition-colors text-sm',
                  currentTripIndex === index 
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                ]"
              >
                {{ index + 1 }}
              </button>
            </div>

            <button 
              @click="nextTrip" 
              :disabled="currentTripIndex === trips.length - 1"
              class="bg-gradient-to-r from-indigo-600 to-blue-500 text-white w-10 h-10 rounded-full 
                     flex items-center justify-center transform transition-all hover:scale-105
                     disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-grow flex" :class="{'flex-col': isMapExpanded}">
          <!-- Trip List Section -->
          <div 
            v-if="!isMapExpanded"
            class="w-full lg:w-1/2 p-6 transition-all duration-300"
          >
            <div class="h-full flex flex-col">
              <div class="flex-grow overflow-y-auto scroll-container">
                <div class="space-y-4">
                  <p v-if="currentTrip" class="text-indigo-600 font-medium text-lg mb-2">{{ currentTrip.title }}</p>
                  <div 
                    v-if="currentTrip"
                    v-for="(edge, index) in currentTrip.edges" 
                    :key="index"
                    class="p-4 bg-gray-50 rounded-lg transition-all hover:bg-gray-100 cursor-pointer"
                  >
                    <EdgeDetail :edge="edge" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Map Section -->
          <div 
            class="w-full transition-all duration-300 p-4"
            :class="{
              'lg:w-1/2 h-[500px]': !isMapExpanded,
              'w-full h-[calc(100vh-200px)]': isMapExpanded
            }"
          >
            <BasicMap 
              v-if="currentTrip"
              :trip="currentTrip" 
              :is-expanded="isMapExpanded"
              class="h-full w-full rounded-xl shadow-sm border border-gray-100"
            />
          </div>
        </div>

        <!-- Modification Section -->
        <div class="p-6 border-t border-gray-100">
          <div class="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
            <textarea 
              v-model="modificationPrompt"
              placeholder="How would you like to modify your trips?"
              class="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
              rows="2"
            ></textarea>
            <div class="mt-4 flex justify-end space-x-3">
              <button 
                class="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-sm"
                @click="clearPrompt"
              >
                Clear
              </button>
              <button 
                class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full hover:scale-105 transition-transform text-sm"
                @click="submitModification"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, nextTick, watch } from 'vue'
import { useTripStore } from '../store/trip'
import { useItineraryStore } from '../store/itinerary'
import BasicMap from '../components/BasicMap.vue'
import EdgeDetail from '../components/EdgeDetail.vue'
import Loading from '../components/Loading.vue'
import { 
  ArrowsPointingOutIcon, 
  ArrowsPointingInIcon, 
  SparklesIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon 
} from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'

export default {
  components: {
    BasicMap,
    EdgeDetail,
    Loading,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    SparklesIcon,
    ArrowLeftIcon,
    ArrowRightIcon
  },
  setup() {
    const tripStore = useTripStore()
    const itineraryStore = useItineraryStore()
    const router = useRouter()
    const trips = computed(() => tripStore.trips)
    const loading = computed(() => tripStore.loading)
    const loadingMessage = computed(() => tripStore.loadingMessage)
    const currentTripIndex = ref(0)
    const isMapExpanded = ref(false)
    const modificationPrompt = ref('')

    const currentTrip = computed(() => trips.value[currentTripIndex.value])

    watch(trips, () => {
      if (trips.value.length > 0) {
        currentTripIndex.value = 0
      }
    })

    const toggleMapExpansion = async () => {
      isMapExpanded.value = !isMapExpanded.value
      await nextTick()
      window.dispatchEvent(new Event('resize'))
    }

    const generateItinerary = async () => {
      await itineraryStore.generateItinerary()
      if (!itineraryStore.error) {
        // Use router to navigate to itinerary page
        router.push('/iternary')
      }
    }

    const nextTrip = () => {
      if (currentTripIndex.value < trips.value.length - 1) {
        currentTripIndex.value++
      }
    }

    const prevTrip = () => {
      if (currentTripIndex.value > 0) {
        currentTripIndex.value--
      }
    }

    const goToTrip = (index) => {
      currentTripIndex.value = index
    }

    const clearPrompt = () => {
      modificationPrompt.value = ''
    }

    const submitModification = async () => {
      tripStore.modificationPrompt = modificationPrompt.value;
     
      if (tripStore.modificationPrompt.trim()) {
        try {
          await tripStore.submitModification();
        } catch (error) {
          console.error('Error submitting modification:', error);
        }
      }
    };

    return {
      trips,
      loading,
      currentTrip,
      currentTripIndex,
      isMapExpanded,
      modificationPrompt,
      nextTrip,
      prevTrip,
      goToTrip,
      toggleMapExpansion,
      generateItinerary,
      clearPrompt,
      submitModification
    }
  }
}
</script>

<style scoped>
.scroll-container {
  scrollbar-width: thin;
  scrollbar-color: #c7d2fe #f8fafc;
  max-height: calc(100vh - 300px);
  min-height: 300px;
}

.scroll-container::-webkit-scrollbar {
  width: 5px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a5b4fc;
}

:deep(.mapboxgl-map) {
  height: 100% !important;
  min-height: 400px;
}

@media (min-width: 1024px) {
  .scroll-container {
    max-height: calc(100vh - 280px);
  }
}
</style>