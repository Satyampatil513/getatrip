<template>
    <div class="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4"
         :style="{
           backgroundImage: `url(${backgroundImage})`,
           backgroundSize: '80%',
           backgroundRepeat: 'no-repeat',
           backgroundPosition: 'center bottom'
         }">
         <p  class="text-sm text-gray-600">Find your Next Best Trip!</p>
      <!-- <h1 class="text-4xl md:text-6xl font-bold gradient-text animate-bounce">Travo.</h1>
      <h2 class="text-xl md:text-3xl font-light mt-2 text-gray-200 font-condensed p-4 rounded-lg bg-black">Find your next best trip!</h2>
   -->
      <form v-if="showForm" class="mt-10 flex flex-col items-center space-y-6 w-full max-w-lg" @submit.prevent="handleSubmit">
        <div class="relative transition-all duration-500 w-full">
          <fa-search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Start Location" class="bg-white text-black border border-gray-300 p-2 pl-10 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" v-model="startLocation" />
        </div>
  
        <div class="flex items-center w-full">
          <div v-if="!isSurprise" class="relative flex-grow mr-2">
            <fa-search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Destination (optional)" class="bg-white text-black border border-gray-300 p-2 pl-10 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500" v-model="destination" />
          </div>
          <label class="flex items-center text-sm text-gray-300 bg-black">
            <input type="checkbox" @change="handleSurpriseChange" v-model="isSurprise" />
            <span class="ml-2">Surprise Me!</span>
          </label>
        </div>
  
        <button v-if="!showDatePicker" type="button" class="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-full transition duration-200" @click="showDatePicker = true">Choose Dates</button>
        <fa-times v-else class="text-red-500 cursor-pointer" @click="showDatePicker = false" />
  
        <date-picker v-if="showDatePicker" :start-date="startDate" :end-date="endDate" @date-change="onDateChange" />
  
        <div v-if="startDate && endDate" class="bg-white text-black rounded-full p-2 text-center">
          <p>From {{ startDate.toLocaleDateString() }} to {{ endDate.toLocaleDateString() }}</p>
        </div>
  
        <div class="flex flex-wrap justify-between w-full">
          <select-multi :options="transportOptions" placeholder="Transport Mode" v-model="transportMode" />
          <select-multi :options="tripTypeOptions" placeholder="Trip Type" v-model="tripType" />
        </div>
  
        <button type="submit" class="bg-blue-500 hover:bg-blue-400 text-white py-2 px-4 rounded-full transition duration-200">Find Trips</button>
      </form>
  
      <div v-else>
        <div v-if="loading" class="text-xl">Loading...</div>
        <div v-else>
          <trip-card :trip="trips[currentTripIndex]" />
          <div class="flex justify-between w-full mb-4">
            <button @click="prevTrip" class="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg" :disabled="currentTripIndex === 0">Previous</button>
            <button @click="nextTrip" class="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg" :disabled="currentTripIndex === trips.length - 1">Next</button>
          </div>
        </div>
      </div>
  
      <div v-if="showForm && !loading && suggestedPlaces.length > 0" class="flex space-x-4 mt-6">
        <div v-for="(place, index) in suggestedPlaces" :key="index" class="bg-gray-200 rounded-lg shadow-lg p-4 w-1/4">
          <img :src="place.image" :alt="place.name" class="rounded-lg mb-2" />
          <h3 class="text-xl font-bold">{{ place.name }}</h3>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
//   import { FaSearch, FaTimes } from 'react-icons/fa';
  import DatePicker from './DatePicker.vue';
  import SelectMulti from './SelectMulti.vue';
  import TripCard from './TripCard.vue';
  import backgroundImage from '../assets/3375963.png';
//   import { sendTripFormData, sendSuggestedPlacesRequest } from '../api/api';
  
  export default {
    components: {
    //   FaSearch,
    //   FaTimes,
      DatePicker,
      SelectMulti,
      TripCard
    },
    setup() {
      const startLocation = ref('');
      const location = ref('');
      const destination = ref('');
      const startDate = ref(null);
      const endDate = ref(null);
      const tripType = ref([]);
      const transportMode = ref([]);
      const trips = ref([]);
      const showForm = ref(true);
      const isSurprise = ref(false);
      const showDatePicker = ref(false);
      const loading = ref(false);
      const currentTripIndex = ref(0);
      const suggestedPlaces = ref([]);
  
      const transportOptions = [
        { value: 'Car', label: 'Car' },
        { value: 'Plane', label: 'Plane' },
        { value: 'Train', label: 'Train' }
      ];
  
      const tripTypeOptions = [
        { value: 'Adventure', label: 'Adventure' },
        { value: 'Historical', label: 'Historical' },
        { value: 'Leisure', label: 'Leisure' }
      ];
  
      const onDateChange = (dates) => {
        const [start, end] = dates;
        startDate.value = start;
        endDate.value = end;
        if (start && end) {
          showDatePicker.value = false;
        }
      };
  
      const handleSubmit = async () => {
        const formData = {
          startLocation: startLocation.value,
          destination: isSurprise.value ? "" : destination.value,
          startDate: startDate.value,
          endDate: endDate.value,
          tripType: tripType.value.map(type => type.value),
          transportMode: transportMode.value.map(mode => mode.value),
        };
  
        loading.value = true;
        try {
          const response = await sendTripFormData(formData);
          const cleanResponse = response.replace(/^``json\s*/i, '').replace(/``$/, '');
          const tripsData = JSON.parse(cleanResponse.trim());
          trips.value = tripsData;
          currentTripIndex.value = 0;
          showForm.value = false;
          loading.value = false;
        } catch (error) {
          console.error('Error fetching trips:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const handleSurpriseChange = (checked) => {
        isSurprise.value = checked;
        if (checked) {
          destination.value = '';
        }
      };
  
      const nextTrip = () => {
        if (currentTripIndex.value < trips.value.length - 1) {
          currentTripIndex.value += 1;
        }
      };
  
      const prevTrip = () => {
        if (currentTripIndex.value > 0) {
          currentTripIndex.value -= 1;
        }
      };
  
      return {
        startLocation,
        location,
        destination,
        startDate,
        endDate,
        tripType,
        transportMode,
        trips,
        showForm,
        isSurprise,
        showDatePicker,
        loading,
        currentTripIndex,
        suggestedPlaces,
        transportOptions,
        tripTypeOptions,
        onDateChange,
        handleSubmit,
        handleSurpriseChange,
        nextTrip,
        prevTrip
      };
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>