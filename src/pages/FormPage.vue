<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 flex flex-col items-center p-8">
    <!-- Header Section -->
    <div class="text-center mb-12">
      <h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-4">
        Let's Plan Your Perfect Trip ✈️
      </h1>
      <p class="text-gray-600 text-lg">Tell us your preferences and we'll craft amazing experiences</p>
    </div>

    <!-- Main Form -->
    <form v-if="!loading" class="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-8 space-y-12" @submit.prevent="handleSubmit">
      
      <!-- Date & Locations Section -->
      <div class="grid md:grid-cols-2 gap-8 items-start">
        <!-- Date Picker Column -->
        <div class="space-y-6">
          <h3 class="text-xl font-semibold text-gray-700 flex items-center">
            <CalendarIcon class="w-6 h-6 mr-2 text-blue-500" />
            Travel Dates
          </h3>
          <div class="flex items-center">
            <DatePicker 
              class="border border-gray-200 rounded-xl p-4 shadow-sm w-full"
              :start-date="startDate" 
              :end-date="endDate" 
              @date-change="onDateChange"
            />
          </div>
        </div>

        <!-- Locations Column -->
        <div class="space-y-6 h-full">
          <h3 class="text-xl font-semibold text-gray-700 flex items-center">
            <MapPinIcon class="w-6 h-6 mr-2 text-blue-500" />
            Travel Locations
          </h3>
          <div class="space-y-6 h-full flex flex-col justify-between">
            <div class="space-y-4">
              <InputField
          label="Starting From"
          placeholder="City, airport, or address"
          :modelValue="startLocation"
          @update:modelValue="startLocation = $event"
          icon = "home"
        >
        </InputField>
        <InputField
          label="Destination"
          placeholder="Where to? (optional)"
          :modelValue="destination"
          @update:modelValue="destination = $event"
          :disabled="isSurprise"
          icon = "flag"
        >
        </InputField>
              <SurpriseToggle v-model="isSurprise" class="mt-2" />

            </div>
            
            <!-- Budget Slider -->
            <div class="pt-4 border-t border-gray-100">
              <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <CurrencyRupeeIcon class="w-5 h-5 mr-2 text-blue-500" />
                Daily Budget
              </h3>
              <SlidingBar 
                :min="0" 
                :max="10000" 
                :step="100" 
                v-model="budget"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Preferences Section -->
      <div class="space-y-8">
        <h3 class="text-xl font-semibold text-gray-700 flex items-center">
          <CogIcon class="w-6 h-6 mr-2 text-blue-500" />
          Travel Preferences
        </h3>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-4 p-6 bg-gray-50 rounded-xl">
            <CheckBoxGroup 
              label="Transport Modes"
              :options="transportOptions"
              v-model="selectedTransportModes"
              icon-class="text-blue-500"
            />
          </div>
          <div class="space-y-4 p-6 bg-gray-50 rounded-xl">
            <CheckBoxGroup 
              label="Trip Types"
              :options="tripTypeOptions"
              v-model="selectedTripTypes"
              icon-class="text-purple-500"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center pt-8">
        <button 
          type="submit"
          class="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-12 py-4 rounded-full font-semibold
                 transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center"
        >
          <SparklesIcon class="w-5 h-5 mr-2" />
          Generate Travel Plan
        </button>
      </div>
    </form>

    <Loading v-else />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useTripStore } from '../store/trip';
import DatePicker from '../components/DatePicker.vue';
import SlidingBar from '../components/SlidingBar.vue';
import CheckBoxGroup from '../components/CheckBoxGroup.vue';
import Loading from '../components/Loading.vue';
import { CalendarIcon, MapPinIcon, CurrencyRupeeIcon, CogIcon,SparklesIcon, HomeIcon, FlagIcon } from '@heroicons/vue/24/outline';
import InputField from '../components/InputField.vue';
import SurpriseToggle from '../components/SurpriseToggle.vue';

export default {
  components: {
    DatePicker,
    SlidingBar,
    CheckBoxGroup,
    Loading,
    CalendarIcon,
    MapPinIcon,
    CurrencyRupeeIcon,
    CogIcon,
    InputField,
    SparklesIcon,
    SurpriseToggle
  },
  setup() {
    const router = useRouter();
    const tripStore = useTripStore();
    const loading = computed(() => tripStore.loading);

    const startDate = ref(null);
    const endDate = ref(null);
    const startLocation = ref('');
    const destination = ref('');
    const isSurprise = ref(false);

    watch(isSurprise, (newVal) => {
    if (newVal) destination.value = ''
    })

    const transportOptions = [
      { value: 'Car', label: 'Car' },
      { value: 'Plane', label: 'Plane' },
      { value: 'Train', label: 'Train' },
      {value: 'Bus', label: 'Bus'},
    ];

    const tripTypeOptions = [
      { value: 'Adventure', label: 'Adventure' },
      { value: 'Historical', label: 'Historical' },
      { value: 'Leisure', label: 'Leisure' },
    ];

    const selectedTransportModes = ref([]);
    const selectedTripTypes = ref([]);
    const budget = ref(5000);

    const onDateChange = (dates) => {
      const [start, end] = dates;
      startDate.value = start;
      endDate.value = end;
    };

    const handleSubmit = async () => {
      tripStore.startDate = startDate.value;
      tripStore.endDate = endDate.value;
      tripStore.startLocation = startLocation.value;
      tripStore.destination = destination.value;
      tripStore.transportMode = selectedTransportModes.value;
      tripStore.tripType = selectedTripTypes.value;
      tripStore.budget = budget.value;
      tripStore.isSurprise = isSurprise.value;
      tripStore.sessionId = null;
      tripStore.modificationPrompt = '';
      console.log(startDate.value, endDate.value, startLocation.value, destination.value, selectedTransportModes.value, selectedTripTypes.value, budget.value);
      await tripStore.fetchTrips();
      router.push('/trips'); // Redirect to Trips List Page after fetching trips
    };

    // const handleSurpriseChange = () => {
    //   isSurprise.value = !isSurprise.value;
    //   if (isSurprise.value) {
    //     destination.value = '';
    //   }
    // };

    return {
      startDate,
      endDate,
      startLocation,
      destination,
      isSurprise,
      transportOptions,
      tripTypeOptions,
      selectedTransportModes,
      selectedTripTypes,
      budget,
      onDateChange,
      handleSubmit,
      loading,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>