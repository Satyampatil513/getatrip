<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Processing...</h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  const code = route.query.code
  if (code) {
    console.log("code",code)
    try {
      const response = await fetch(import.meta.env.VITE_APP_REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleAuthCode: code,
        }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        router.push('/')
      } else {
        console.error('Google Sign-Up error:', data.message)
        router.push('/register')
      }
    } catch (err) {
      console.error('Google Sign-Up error:', err)
      router.push('/register')
    }
  } else {
    router.push('/register')
  }
})
</script>

<style scoped>
/* Add your styles here */
</style>