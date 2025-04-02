<template>
 
    <VueDatePicker 
      v-model="date"
      range
      inline
      :enable-time-picker="false"
      class="custom-datepicker rounded-xl border border-gray-200 shadow-sm"
    />
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const emit = defineEmits(['date-change']);
const date = ref([]);

const emitDateChange = (value) => {
  date.value = value;
  emit('date-change', value);
};

onMounted(() => {
  const startDate = new Date();
  const endDate = new Date(new Date().setDate(startDate.getDate() + 7));
  date.value = [startDate, endDate];
  emitDateChange(date.value);
});
</script>

<style>
.custom-datepicker {
  --dp-border-radius: 16px;
  --dp-cell-border-radius: 8px;
  --dp-primary-color: #4f46e5;
  --dp-cell-size: 40px;
  --dp-font-size: 1rem;
}

:deep(.dp__calendar) {
  @apply w-full p-3;
}

:deep(.dp__calendar_header) {
  @apply py-3 mb-1 text-gray-600 font-medium;
}

:deep(.dp__calendar_row) {
  @apply gap-1;
}
</style>