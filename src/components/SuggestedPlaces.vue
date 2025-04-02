<template>
  <div class="suggested-places grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
    <div 
      v-for="(place, index) in places" 
      :key="place.id"
      class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <!-- Image Container -->
      <div class="relative aspect-square overflow-hidden">
        <img 
          :src="getImageUrl(index)"
          @error="handleImageError"
          :alt="place.title"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
      </div>

      <!-- Content Section -->
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {{ place.title }}
        </h3>
        <p class="text-gray-600 text-sm line-clamp-3">
          {{ place.description }}
        </p>
        <div class="mt-4 flex items-center space-x-2">
          <span class="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs">
            Trending
          </span>
        </div>
      </div>
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
    async getWikipediaImage(title) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=400`
    );
    const data = await response.json();
    return data.query.pages[Object.keys(data.query.pages)[0]].thumbnail.source;
  } catch (error) {
    return null;
  }
}
  },
};
</script>

<style scoped>
.suggested-places {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
</style>
