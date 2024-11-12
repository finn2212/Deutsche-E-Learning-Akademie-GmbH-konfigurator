<template>
    <table class="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th class="px-4 py-2 border-b">ID</th>
          <th class="px-4 py-2 border-b">Title</th>
          <th class="px-4 py-2 border-b">Description</th>
          <th class="px-4 py-2 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courseTypes" :key="course.id" class="hover:bg-gray-100">
          <td class="px-4 py-2 border-b text-center">{{ course.id }}</td>
          <td class="px-4 py-2 border-b">{{ course.title }}</td>
          <td class="px-4 py-2 border-b">{{ course.description_long }}</td>
          <td class="px-4 py-2 border-b text-center">
            <button @click="editCourse(course)" class="text-blue-500 hover:text-blue-700 mr-2">✏️</button>
            <button @click="deleteCourse(course.id)" class="text-red-500 hover:text-red-700">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    courseTypes: Array
  });
  
  const emit = defineEmits(['editCourse', 'deleteCourse']);
  
  const editCourse = (course) => {
    emit('editCourse', course);
  };
  
  const deleteCourse = (courseId) => {
    emit('deleteCourse', courseId);
  };
  </script>
  