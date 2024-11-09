<template>
    <div>
      <button @click="$emit('goBack')" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">
        Back
      </button>
      <h2 class="text-xl font-semibold mb-4">Detail View for {{ item.title }}</h2>
      <!-- Display item details here -->
      <p><strong>ID:</strong> {{ item.id }}</p>
      <p><strong>Kurs:</strong> {{ item.title }}</p>
      <p><strong>Standort:</strong> {{ item.location_name }}</p>
      <p><strong>Startd:</strong> {{ item.date_label }}</p>
      <!-- Add more details as needed -->
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    item: Object
  });
  </script>
  