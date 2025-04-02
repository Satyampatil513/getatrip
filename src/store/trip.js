import { defineStore } from 'pinia';

// Helper function to persist state to local storage
function saveStateToLocalStorage(key, state) {
  localStorage.setItem(key, JSON.stringify(state));
}

// Helper function to load state from local storage
function loadStateFromLocalStorage(key, defaultState) {
  const storedState = localStorage.getItem(key);
  return storedState ? JSON.parse(storedState) : defaultState;
}

export const useTripStore = defineStore('trip', {
  state: () => ({
    ...loadStateFromLocalStorage('tripStore', {
      sessionId: null,
      modificationPrompt: '',
      startLocation: '',
      destination: '',
      startDate: null,
      endDate: null,
      tripType: [],
      transportMode: [],
      trips: [],
      loading: false,
      currentTripIndex: 0,
      isSurprise: false,
      loadingMessage: 'Crafting your perfect experience...',
    }),
  }),
  actions: {
    async fetchTrips() {
      this.loading = true;
      console.log('prompt', this.modificationPrompt);
      console.log('sessionid',this.sessionId);
      this.loadingMessage = this.modificationPrompt === '' 
        ? 'Crafting your perfect experience...' 
        : 'Applying your changes...';
      try {
        const formData = {
          sessionId: this.sessionId,
          modificationPrompt: this.modificationPrompt,
          startLocation: this.startLocation,
          destination: this.isSurprise ? '' : this.destination,
          startDate: this.startDate,
          endDate: this.endDate,
          tripType: this.tripType,
          transportMode: this.transportMode,
        };

        const response = await fetch("https://3g6hvwstwyahfk2aa7catz7doa0bxwok.lambda-url.ap-southeast-2.on.aws/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const responseData = await response.json();
        console.log(responseData);
        var responsed = responseData.data.replace(/```json\n|```/g, '');
        this.modificationPrompt = '';
        this.trips = JSON.parse(responsed);
        this.sessionId = responseData.sessionId;
        console.log(responsed);
        console.log('Trips:', this.trips);
        this.currentTripIndex = 0;
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        this.loading = false;
        this.persistState();
      }
    },
    setSurprise(value) {
      this.isSurprise = value;
      if (value) {
        this.destination = '';
      }
      this.persistState();
    },
    nextTrip() {
      if (this.currentTripIndex < this.trips.length - 1) {
        this.currentTripIndex += 1;
        this.persistState();
      }
    },
    prevTrip() {
      if (this.currentTripIndex > 0) {
        this.currentTripIndex -= 1;
        this.persistState();
      }
    },
    persistState() {
      saveStateToLocalStorage('tripStore', this.$state);
    },

    resetSession() {
      this.sessionId = null;
      this.trips = [];
      this.modificationPrompt = '';
    },
    async submitModification() {
      if (this.modificationPrompt.trim()) {
        await this.fetchTrips();
      }
    }
  },
});