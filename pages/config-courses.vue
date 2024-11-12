<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold mb-4">Course Types</h1>

    <!-- "Create New" Button, shown only when form is not visible -->
    <button v-if="!isFormVisible" @click="openCreateForm" class="px-4 py-2 bg-green-600 text-white rounded mb-4">Create New</button>

    <!-- Show CourseTable if form is not visible -->
    <CourseTable v-if="!isFormVisible" :courseTypes="courseTypes" @editCourse="openEditForm" @deleteCourse="deleteCourse" />

    <!-- Show CourseCreateEdit for creating/editing if form is visible -->
    <CourseCreateEdit
      v-else
      :course="selectedCourse"
      :isEditMode="isEditMode"
      @closeForm="closeForm"
      @saveCourse="saveCourse"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import CourseTable from '../components/config-courses/CourseTable.vue';
import CourseCreateEdit from '../components/config-courses/CourseCreateEdit.vue';

const { $supabase } = useNuxtApp();
const courseTypes = ref([]);
const selectedCourse = ref(null);
const isFormVisible = ref(false);
const isEditMode = ref(false);

// Fetch course types data from Supabase
const fetchCourseTypes = async () => {
  const { data, error } = await $supabase.from('course_types').select('*');
  if (error) {
    console.error('Error fetching course types:', error);
  } else {
    courseTypes.value = data;
  }
};

// Open form for creating a new course
const openCreateForm = () => {
  selectedCourse.value = null;
  isEditMode.value = false;
  isFormVisible.value = true;
};

// Open form for editing a course
const openEditForm = (course) => {
  selectedCourse.value = course;
  isEditMode.value = true;
  isFormVisible.value = true;
};

// Close form
const closeForm = () => {
  isFormVisible.value = false;
  selectedCourse.value = null;
};

// Save course data to Supabase
const saveCourse = async (courseData) => {
  if (isEditMode.value) {
    const { error } = await $supabase.from('course_types').update(courseData).eq('id', courseData.id);
    if (error) {
      console.error("Error updating course:", error);
    }
  } else {
    const { error } = await $supabase.from('course_types').insert(courseData);
    if (error) {
      console.error("Error creating course:", error);
    }
  }
  closeForm();
  fetchCourseTypes(); // Refresh course data
};

// Delete course data from Supabase
const deleteCourse = async (courseId) => {
  const { error } = await $supabase.from('course_types').delete().eq('id', courseId);
  if (error) {
    console.error("Error deleting course:", error);
  } else {
    fetchCourseTypes(); // Refresh course data after deletion
  }
};

// Fetch data on component mount
onMounted(fetchCourseTypes);
</script>

<style scoped>
/* Add any additional styles here if necessary */
</style>
