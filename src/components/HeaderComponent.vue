<template>
  <header class="flex items-center justify-between py-5 px-8 bg-white/90 backdrop-blur-sm shadow-sm">
    <!-- Left Section -->
    <div class="flex items-center space-x-4">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        {{ title }}
      </h1>
      <div class="h-8 w-px bg-gray-200"></div>
      <h2 class="text-lg text-gray-500 font-medium">{{ subtitle }}</h2>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-6">
      <div v-if="isLoggedIn" class="flex items-center gap-6">
        <!-- User Profile -->
        <div class="flex items-center gap-3 group cursor-pointer">
          <div class="relative">
            <div class="absolute inset-0 bg-indigo-100/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div v-if="user.picture && !imageError" class="relative">
              <img 
                :src="user.picture" 
                alt="Profile" 
                class="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                @error="handleImageError"
              />
            </div>
            <div v-else class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-50">
              <span class="text-indigo-600 font-medium text-lg">{{ userInitial }}</span>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-600">Welcome back</span>
            <span class="text-base font-semibold text-gray-800">{{ user.name }}</span>
          </div>
        </div>

        <!-- Logout Button -->
        <button 
          @click="handleLogout"
          class="flex items-center gap-2 px-5 py-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" 
               class="h-5 w-5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" 
               fill="none" 
               viewBox="0 0 24 24" 
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="font-medium">Logout</span>
        </button>
      </div>

      <!-- Google Login -->
      <div v-else>
        <GoogleLogin 
          :client-id="googleClientId" 
          :callback="handleGoogleLogin"
          class="custom-google-button"
          
        >
          <button class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl font-medium
                        shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 5c1.61 0 3.09.59 4.23 1.57l3.04-3.04C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7h3.15c.94-2.07 3.03-3.5 5.67-3.5 1.56 0 2.96.53 4.04 1.36l-2.42 2.42C14.08 5.85 13.07 5 12 5zM23 12c0-1.12-.19-2.23-.5-3.3H12v6.6h6.13c-.27 1.34-1.02 2.48-2.06 3.3l3.13 2.4C21.7 17 23 14.63 23 12z"/>
              <path fill="currentColor" d="M5 12c0-.94.17-1.84.47-2.7H2.18v3.4H5c.24.68.6 1.3 1.06 1.84l-3.22 2.48C1.3 16.45 1 14.27 1 12c0-3.8 2.18-7.12 5.33-8.8l2.42 2.42C7.62 6.3 7 9.05 7 12c0 .45.04.89.1 1.3H7v-2.6H1.4v3.4h3.15c1.13 2.47 3.53 4.2 6.45 4.2 1.93 0 3.68-.76 4.98-2l-2.38-1.84c-.65.45-1.47.74-2.4.74-1.84 0-3.4-1.23-3.93-2.9H12v-3.4H8.67c-.07.24-.11.5-.11.8 0 1.5 1.09 2.7 2.44 2.7z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </GoogleLogin>
      </div>
    </div>
  </header>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {decodeCredential} from 'vue3-google-login';

const router = useRouter();
const user = ref(null);
const isLoggedIn = computed(() => !!user.value);

const googleClientId = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

const handleGoogleLogin = async (response) => {
  try {
    const authCode = response.code;
    const res = await fetch('https://w5hazyvnbpubtkxj3ju5agkyei0oyaiu.lambda-url.ap-southeast-2.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: authCode }),
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      user.value = data.user;
      router.push('/');
    } else {
      console.error('Google Sign-In error:', data.error);
    }
  } catch (err) {
    console.error('Google Sign-In error:', err);
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  user.value = null;
  router.push('/');
};

// Check if user is already logged in
const token = localStorage.getItem('token');
if (token) {
  // Decode the token to get user info (you might need a library like jwt-decode)
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  user.value = { email: decodedToken.email, name: decodedToken.name, picture: decodedToken.picture };
}
</script>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.custom-google-button {
  @apply transition-transform duration-200 hover:scale-105;
}

.border-primary {
  border-color: #3B82F6; /* Replace with your primary color */
}

.text-primary {
  color: #3B82F6; /* Replace with your primary color */
}

.hover\:bg-primary-alt:hover {
  background-color: #2563EB; /* Replace with your primary hover color */
}
</style>



