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
              <h3 class="text-sm font-medium text-gray-900">Possible combinations: {{ calculateCombinations() }}</h3>
            </div>
            <div>
              <button @click="exportCourses" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Export Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
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
  
  const getCourseName = (courseId) => {
    const course = props.courses.find(course => course.id === courseId)
    return course ? course.name : 'Unknown Course'
  }
  
  const calculateCombinations = () => {
    let combinations = 0
    props.selectedCourses.forEach(courseId => {
      const course = props.courses.find(course => course.id === courseId)
      if (course) {
        const titles = course.titles.length
        const times = course.start_time_ids.length
        const locations = course.location_ids.length
        combinations += titles * times * locations
      }
    })
    return combinations
  }
  
  const exportCourses = () => {
    let exportData = []
    props.selectedCourses.forEach(courseId => {
      const course = props.courses.find(course => course.id === courseId)
      if (course) {
        const titles = course.titles
        const times = getStartTimesForCourse(course.start_time_ids)
        const locations = getLocationNames(course.location_ids)
  
        titles.forEach(title => {
          times.forEach(time => {
            locations.forEach(location => {
              exportData.push({ title, time, location })
            })
          })
        })
      }
    })
    console.log('Export Data:', exportData)
    // Implement the export functionality here (e.g., export to CSV or JSON file)
  }
  
  const getLocationNames = (locationIds) => {
    const locations = props.courses.flatMap(course => course.locations || [])
    return locations
      .filter(loc => locationIds.includes(loc.id))
      .map(loc => loc.name)
  }
  
  const getStartTimesForCourse = (startTimeIds) => {
    const startTimes = props.courses.flatMap(course => course.start_times || [])
    return startTimes
      .filter(time => startTimeIds.includes(time.id))
      .map(time => time.time)
  }
  </script>
  