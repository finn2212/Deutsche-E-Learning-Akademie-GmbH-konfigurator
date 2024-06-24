<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Manage Courses</h1>
    <button @click="openCourseForm" type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-4">
      <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
      Add Course
    </button>
    <div v-if="loading" class="text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Loading courses...</h3>
      <div class="mt-6">
        <div class="spinner"></div>
      </div>
    </div>
    <div v-else-if="courses.length === 0" class="text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No courses</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new course.</p>
      <div class="mt-6">
        <button @click="openCourseForm" type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New Course
        </button>
      </div>
    </div>
    <div v-else>
      <div v-for="course in courses" :key="course.id" class="border rounded p-4 mb-4">
        <h2 class="text-xl font-semibold">Titles: {{ course.titles.join(', ') }}</h2>
        <p>Types: {{ course.types.join(', ') }}</p>
        <h3 class="font-semibold">Locations:</h3>
        <p>{{ getLocationNames(course.location_ids).join(', ') }}</p>
        <div>
          <h3 class="font-semibold">Startzeiten:</h3>
          <ul>
            <li v-for="time in getStartTimesForCourse(course.start_time_ids)" :key="time">{{ time }}</li>
          </ul>
        </div>
        <button @click="editCourse(course)" class="mr-2 px-4 py-2 bg-yellow-500 text-white rounded">Edit</button>
        <button @click="deleteCourse(course.id)" class="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
      </div>
    </div>
    <CourseForm :course="selectedCourse" @close="closeCourseForm" @add-course="addCourse" v-if="showCourseForm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CourseForm from '@/components/CourseForm.vue'
import { useNuxtApp } from '#app'
import { PlusIcon } from '@heroicons/vue/20/solid'

const { $supabase } = useNuxtApp()
const courses = ref([])
const locations = ref([])
const startTimes = ref([])
const loading = ref(true)

const showCourseForm = ref(false)
const selectedCourse = ref(null)

const openCourseForm = () => {
  selectedCourse.value = null
  showCourseForm.value = true
}

const closeCourseForm = () => {
  showCourseForm.value = false
}

const editCourse = (course) => {
  selectedCourse.value = course
  showCourseForm.value = true
}

const deleteCourse = async (courseId) => {
  await $supabase
    .from('courses')
    .delete()
    .eq('id', courseId)

  courses.value = courses.value.filter(course => course.id !== courseId)
}

const addCourse = (course) => {
  const existingCourseIndex = courses.value.findIndex(c => c.id === course.id)
  if (existingCourseIndex !== -1) {
    courses.value[existingCourseIndex] = course
  } else {
    courses.value.push(course)
  }
}

const getCourses = async () => {
  const { data } = await $supabase
    .from('courses')
    .select('*')

  courses.value = data
  loading.value = false
}

const getLocations = async () => {
  const { data } = await $supabase
    .from('places')
    .select('*')

  locations.value = data
}

const fetchStartTimes = async () => {
  const { data } = await $supabase
    .from('start_times')
    .select('*')

  startTimes.value = data
}

const getLocationNames = (locationIds) => {
  return locations.value.filter(loc => locationIds.includes(loc.id)).map(loc => loc.name)
}

const getStartTimesForCourse = (startTimeIds) => {
  return startTimes.value.filter(time => startTimeIds.includes(time.id)).map(time => time.time)
}

onMounted(() => {
  getCourses()
  getLocations()
  fetchStartTimes()
})
</script>

<style>
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left-color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
