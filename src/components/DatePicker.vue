<template>
    <VueDatePicker v-model="date" range />
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  
  const date = ref();
  
  onMounted(() => {
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
    date.value = [startDate, endDate];
  });
  </script>
  
  <!-- <style src="vue-datepicker/dist/vue-datepicker.css"></style> -->