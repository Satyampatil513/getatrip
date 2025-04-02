<template>
    <div>
      <span class="material-icons-outlined w-6 h-6 text-white-300">{{ iconName }}</span>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      mode: {
        type: String,
        required: true,
      },
    },
    computed: {
      iconName() {
        switch (this.mode) {
          case 'Car':
            return 'directions_car';
          case 'Bus':
            return 'directions_bus';
          case 'Train':
            return 'train';
          case 'Flight':
          case 'Plane':
            return 'flight';
          case 'Taxi':
            return 'local_taxi';
          default:
            return 'help_outline';
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .material-icons-outlined {
    font-size: 24px;
  }
  </style>