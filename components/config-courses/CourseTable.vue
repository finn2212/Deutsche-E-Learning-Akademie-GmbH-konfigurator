<template>
    <table class="min-w-full bg-white border border-gray-200">
      <thead>
        <tr>
          <th class="px-4 py-2 border-b text-left">ID</th>
          <th class="px-4 py-2 border-b text-left">Title</th>
          <th class="px-4 py-2 border-b text-left">Kurs Form</th>
          <th class="px-4 py-2 border-b text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courseTypes" :key="course.id" class="hover:bg-gray-100">
          <td class="px-4 py-2 border-b text-left">{{ course.id }}</td>
          <td class="px-4 py-2 border-b text-left">{{ course.title }}</td>
          <td class="px-4 py-2 border-b text-left">{{ course.instruction_form }}</td>
          <td class="px-4 py-2 border-b text-left">
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
  