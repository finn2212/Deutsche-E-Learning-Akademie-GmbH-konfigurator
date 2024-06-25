<template>
    <div>
      <h2 class="text-xl font-semibold mb-4">Kurse Konfigurieren</h2>
      <div class="flex items-center mb-4">
        <button @click="openCourseForm" type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-4">
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Add Course
        </button>
        <button @click="goToNextStep" :disabled="disableNext" :class="['inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2', disableNext ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600']">
          Kurse Exportieren
        </button>
      </div>
      <div v-if="courses.length === 0" class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-semibold text-gray-900">No courses</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating a new course.</p>
      </div>
      <div v-else>
        <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <li v-for="course in courses" :key="course.id" class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow relative">
            <div class="flex flex-1 flex-col p-8 text-left">
              <h3 class="text-sm font-medium text-gray-900">Titles: {{ course.titles.join(', ') }}</h3>
              <dl class="mt-1 flex flex-grow flex-col justify-between">
                <dt class="sr-only">Types</dt>
                <dd class="text-sm text-gray-500">Types: {{ course.types.join(', ') }}</dd>
                <dt class="sr-only">Locations</dt>
                <dd class="mt-3 text-sm text-gray-500">
                  Locations: {{ getLocationNames(course.location_ids).join(', ') }}
                </dd>
                <dt class="sr-only">Times</dt>
                <dd class="mt-3 text-sm text-gray-500">
                  Times: {{ getStartTimesForCourse(course.start_time_ids).join(', ') }}
                </dd>
              </dl>
              <input
                type="checkbox"
                :value="course.id"
                v-model="localSelectedCourses"
                class="absolute top-2 right-2"
                @change="selectCourse"
              />
            </div>
            <div>
              <div class="-mt-px flex divide-x divide-gray-200">
                <div class="flex w-0 flex-1">
                  <button @click="editCourse(course)" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                    <span>Edit</span>
                  </button>
                </div>
                <div class="-ml-px flex w-0 flex-1">
                  <button @click="deleteCourse(course.id)" class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <CourseForm :course="selectedCourse" @close="closeCourseForm" @add-course="addCourse" v-if="showCourseForm" />
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits, defineProps, watch, onMounted } from 'vue'
  import CourseForm from '@/components/CourseForm.vue'
  import { PlusIcon } from '@heroicons/vue/20/solid'
  import { useNuxtApp } from '#app'
  
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
  
  const emit = defineEmits(['selection-changed', 'next-step'])
  
  const localSelectedCourses = ref([...props.selectedCourses])
  const selectedCourse = ref(null)
  const showCourseForm = ref(false)
  const disableNext = ref(localSelectedCourses.value.length === 0)
  
  const { $supabase } = useNuxtApp()
  const locations = ref([])
  const startTimes = ref([])
  
  const loadLocations = async () => {
    const { data } = await $supabase
      .from('places')
      .select('*')
    locations.value = data
  }
  
  const loadStartTimes = async () => {
    const { data } = await $supabase
      .from('start_times')
      .select('*')
    startTimes.value = data
  }
  
  onMounted(() => {
    loadLocations()
    loadStartTimes()
  })
  
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
    emit('selection-changed', localSelectedCourses.value)
  }
  
  const addCourse = (course) => {
    emit('selection-changed', localSelectedCourses.value)
  }
  
  const selectCourse = () => {
    disableNext.value = localSelectedCourses.value.length === 0
    emit('selection-changed', localSelectedCourses.value)
  }
  
  const goToNextStep = () => {
    emit('next-step')
  }
  
  const getLocationNames = (locationIds) => {
    return locations.value
      .filter(loc => locationIds.includes(loc.id))
      .map(loc => loc.name)
  }
  
  const getStartTimesForCourse = (startTimeIds) => {
    return startTimes.value
      .filter(time => startTimeIds.includes(time.id))
      .map(time => time.time)
  }
  
  watch(localSelectedCourses, (newVal) => {
    emit('update:selectedCourses', newVal)
  })
  
  watch(() => props.selectedCourses, (newVal) => {
    localSelectedCourses.value = [...newVal]
  })
  </script>
  