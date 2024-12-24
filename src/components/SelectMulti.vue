<template>
    <div>
      <VueMultiselect
        v-model="selectedOptions"
        :options="options"
        :placeholder="placeholder"
        multiple
        track-by="value"
        label="label"
        @input="onChange"
      />
    </div>
  </template>
  
  <script>
  import VueMultiselect from 'vue-multiselect';
  import 'vue-multiselect/dist/vue-multiselect.css';
  
  export default {
    components: {
      VueMultiselect
    },
    props: {
      options: {
        type: Array,
        required: true
      },
      placeholder: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        selectedOptions: []
      };
    },
    methods: {
      onChange(selectedOptions) {
        this.$emit('update:modelValue', selectedOptions);
      }
    }
  };
  </script>
  
  <style src="vue-multiselect/dist/vue-multiselect.css"></style>