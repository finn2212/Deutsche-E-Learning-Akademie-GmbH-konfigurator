<template>
    <div>
      <button @click="$emit('goBack')" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">
        Back
      </button>
      <h2 class="text-xl font-semibold mb-4">Detail View for {{ course.title }}</h2>
      <p><strong>ID:</strong> {{ course.id }}</p>
      <p><strong>Title:</strong> {{ course.title }}</p>
      <p><strong>Description:</strong> {{ course.description }}</p>
      <!-- Add other course details here -->
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    course: Object
  });
  </script>
  