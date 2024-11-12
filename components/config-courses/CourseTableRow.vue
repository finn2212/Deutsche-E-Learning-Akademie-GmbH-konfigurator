<template>
    <tr class="hover:bg-gray-100 cursor-pointer" @click="openDetails">
      <td class="px-4 py-2 border-b text-center">{{ course.id }}</td>
      <td class="px-4 py-2 border-b">{{ course.title }}</td>
      <td class="px-4 py-2 border-b">{{ course.education_type1 }}</td>
    </tr>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    course: Object
  });
  
  const emit = defineEmits(['openDetails']);
  
  // Emit an event to open details
  const openDetails = () => {
    emit('openDetails', props.course);
  };
  </script>
  