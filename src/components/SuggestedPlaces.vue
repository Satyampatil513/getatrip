<template>
  <div class="suggested-places flex flex-wrap gap-[62px] justify-center">
    <div class="place flex-1 min-w-[224px] text-center" v-for="(place, index) in places" :key="place.id">
      <img :src="getImageUrl(index)" @error="handleImageError($event)" alt="Place Image" class="w-[224px] h-[250px] rounded-[32px] object-cover" />
      <h3 class="mt-2">{{ place.title }}</h3>
    </div>
  </div>
</template>

<script>
import defaultImage from '../assets/default.png'; // Use relative path

const images = import.meta.glob('../assets/monument_*.png', { eager: true });

export default {
  props: {
    places: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      defaultImage: defaultImage,
    };
  },
  methods: {
    getImageUrl(index) {
      const imageNumber = (index % 4) + 1; // Cycle through 1 to 4
      const imagePath = `../assets/monument_${imageNumber}.png`;
      return images[imagePath]?.default || this.defaultImage;
    },
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>