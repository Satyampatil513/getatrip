import { defineStore } from 'pinia';
import { useTripStore } from './trip';

export const useItineraryStore = defineStore('itinerary', {
  state: () => ({
    itinerary: null,
    loading: false,
    error: null,
    loadingMessage: 'Generating your detailed itinerary...',
  }),
  actions: {
    async generateItinerary() {
      this.loading = true;
      this.error = null;
      const tripStore = useTripStore();
      
      try {
        const formData = {
          sessionId: tripStore.sessionId,
          startLocation: tripStore.startLocation,
          destination: tripStore.isSurprise ? '' : tripStore.destination,
          startDate: tripStore.startDate,
          endDate: tripStore.endDate,
          tripType: tripStore.tripType,
          transportMode: tripStore.transportMode,
          currentTrip: tripStore.trips[tripStore.currentTripIndex]
        };

        const response = await fetch('https://ozszvcvef7qcjjakkgkjiyge6a0wpdwi.lambda-url.ap-southeast-2.on.aws/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        console.log("iternary",result);
        
        if (result.success) {
          const responseData = result.data.replace(/```json\n|```/g, '');
          this.itinerary = JSON.parse(responseData);
          localStorage.setItem('itinerary', JSON.stringify(this.itinerary));
        } else {
          this.error = result.error;
        }
      } catch (error) {
        console.error('Error generating itinerary:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    clearItinerary() {
      this.itinerary = null;
      this.error = null;
      localStorage.removeItem('itinerary');
    },
  },
});