import { defineStore } from 'pinia';

export const useLocationStore = defineStore('location', {
  state: () => ({
    userLocation: null,
    suggestedPlaces: [],
    loading: false,
  }),
  actions: {
    setUserLocation(location) {
      this.userLocation = location;
    },
    clearUserLocation() {
      this.userLocation = null;
    },
    async fetchUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            console.log('User Location:', userLocation);
            this.setUserLocation(userLocation);
            this.fetchSuggestedPlaces();
          },
          (error) => {
            console.error('Error getting user location:', error);
            this.clearUserLocation();
            this.fetchSuggestedPlaces();
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        this.clearUserLocation();
        this.fetchSuggestedPlaces();
      }
    },
    async fetchSuggestedPlaces() {
      this.loading = true;
      try {
        const location = this.userLocation;
        const locationKey = `${location.latitude},${location.longitude}`;
        const cachedPlaces = localStorage.getItem(locationKey);

        if (cachedPlaces) {
          console.log('Using cached suggested places for location:', location);
          this.suggestedPlaces = JSON.parse(cachedPlaces);
        } else {
          console.log('Fetching suggested places for location:', location);
          const response = await fetch('https://dqmokzilsfbsknoih3pj77eaeq0denfa.lambda-url.ap-southeast-2.on.aws/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(location),
          });
          let responseData = await response.json();
          console.log('Suggested Places Response:', responseData, typeof responseData);

          responseData = responseData.replace(/```json\n|```/g, '');
          responseData = JSON.parse(responseData);

          const suggestedPlaces = responseData.map((place) => ({
            id: place.name,
            title: place.name,
            imageUrl: place.image,
            description: place.description,
          }));

          localStorage.setItem(locationKey, JSON.stringify(suggestedPlaces));
          this.suggestedPlaces = suggestedPlaces;
        }
      } catch (error) {
        console.error('Error fetching suggested places:', error);
      } finally {
        this.loading = false;
      }
    },
  },
});