<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Kurse Exportieren</h2>
    <div v-if="selectedCourses.length === 0" class="text-center">
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No courses selected for export</h3>
    </div>
    <div v-else>
      <ul>
        <li v-for="courseId in selectedCourses" :key="courseId">
          <div>
            <h3 class="text-sm font-medium text-gray-900">{{ getCourseName(courseId) }}</h3>
          </div>
        </li>
      </ul>
      <div class="mt-4">
        <div class="flex justify-between items-center border-t border-gray-200 pt-4">
          <div>
            <h3 class="text-sm font-medium text-gray-900">Number of selected courses: {{ selectedCourses.length }}</h3>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-900">Possible combinations: {{ combinations }}</h3>
          </div>
          <div>
            <button @click="exportCourses" :disabled="isLoading"
              class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <span v-if="isLoading" class="spinner-border spinner-border-sm mr-2"></span>
              Export Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue'
import { useNuxtApp } from '#app'

import { useCourseUtils } from '@/composables/useCourseUtils'

const { $supabase } = useNuxtApp()
const { calculateCombinations } = useCourseUtils()

const props = defineProps({
  courses: {
    type: Array,
    required: true
  },
  selectedCourses: {
    type: Array,
    required: true
  }
})

const combinations = ref(0)
const isLoading = ref(false)
const selectedCoursesList = computed(() => {
  return props.courses.filter(course => props.selectedCourses.includes(course.id));
});

onMounted(async () => {
  isLoading.value = true
  const organizationSettings = await fetchOrganizationSettings()
  const courseType = await fetchCourseType(props.courses[0].course_type)

  if (!organizationSettings || !courseType) {
    console.error('Failed to fetch organization settings')
    isLoading.value = false
    return
  }
  combinations.value = await calculateCombinations(selectedCoursesList.value)

  isLoading.value = false
})

const getCourseName = (courseId) => {
  const course = props.courses.find(course => course.id === courseId)
  return course ? course.name : 'Unknown Course'
}

const fetchOrganizationSettings = async () => {
  const { data, error } = await $supabase
    .from('organization_settings')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching organization settings:', error)
    return null
  }

  return data
}

const fetchCourseType = async (courseTypeId) => {
  const { data, error } = await $supabase
    .from('course_types')
    .select('*')
    .eq('id', courseTypeId)
    .single()

  if (error) {
    console.error('Error fetching course type:', error)
    return null
  }

  return data
}



</script>

<style>
.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.25em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}
</style>

