<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Kurse Exportieren</h2>
    <div v-if="selectedCourses.length === 0" class="text-center">
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No courses selected for export</h3>
    </div>
    <div v-else>
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Kurs Präfix</th>
            <th class="py-2 px-4 border-b">Manuelle Sequenz</th>
            <th class="py-2 px-4 border-b">Aktionen</th>
            <th class="py-2 px-4 border-b">Ersatzlieferung</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in selectedCoursesList" :key="course.id">
            <td class="py-2 px-4 border-b">{{ course.name }}</td>
            <td class="py-2 px-4 border-b">{{ course.course_prefix }}</td>
            <td class="py-2 px-4 border-b">
              <input v-model="course.manual_sequence" type="number" class="form-input" placeholder="Sequenz eingeben">
            </td>
            <td class="py-2 px-4 border-b">
              <button @click="applyManualPrefix(course.id, course.manual_sequence)" class="text-black underline block">
                Präfix überschreiben
              </button>
              <button @click="createNewPrefix(course.id)" class="text-black underline block mt-2">
                Neuen Präfix erstellen
              </button>
            </td>

            <td class="py-2 px-4 border-b">
              <select class="form-select">
                <option value="0">Neue Lieferung</option>
                <option value="1">Ersatzlieferung</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
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
import { defineProps, ref, computed, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import XmlHelper from '../helper/xmlHelper' // Adjust the path accordingly
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
  return props.courses.filter(course => props.selectedCourses.includes(course.id))
})

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

const exportCourses = async () => {
  isLoading.value = true
  const organizationSettings = await fetchOrganizationSettings()
  const courseType = await fetchCourseType(props.courses[0].course_type)

  if (!organizationSettings || !courseType) {
    console.error('Failed to fetch organization settings')
    isLoading.value = false
    return
  }

  const xmlHelper = new XmlHelper(organizationSettings, selectedCoursesList.value)
  const xmlString = await xmlHelper.generateXml()
  downloadXML(xmlString)
  isLoading.value = false
}

const createNewPrefix = async (courseId) => {
  const newPrefix = await generateNewCoursePrefix()
  const { data, error } = await $supabase
    .from('courses')
    .update({ course_prefix: newPrefix })
    .eq('id', courseId)

  if (error) {
    console.error('Error updating course prefix:', error)
    return
  }

  // Update the local course data
  const course = selectedCoursesList.value.find(course => course.id === courseId)
  if (course) {
    course.course_prefix = newPrefix
  }
}

const applyManualPrefix = async (courseId, manualSequence) => {
  if (!manualSequence || manualSequence <= 0) {
    console.error('Invalid manual sequence');
    return;
  }

  const newPrefix = 'DELA' + String(manualSequence).padStart(3, '0'); // Ensure the sequence is 3 digits

  const { data, error } = await $supabase
    .from('courses')
    .update({ course_prefix: newPrefix })
    .eq('id', courseId);

  if (error) {
    console.error('Error updating course prefix:', error);
    return;
  }

  // Update the local course data
  const course = selectedCoursesList.value.find(course => course.id === courseId);
  if (course) {
    course.course_prefix = newPrefix;
  }
}

const generateNewCoursePrefix = async () => {
  const { data, error } = await $supabase
    .rpc('generate_sequential_course_prefix') // Assuming you have this function in your database
    .single()

  if (error) {
    console.error('Error generating new course prefix:', error)
    return null
  }

  return data
}

const downloadXML = (xmlString) => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const formattedDateTime = `${day}${month}${String(year).slice(2)}${hours}${minutes}`;
  const filename = `DELAKursexport${formattedDateTime}.xml`;

  const blob = new Blob([xmlString], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
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
  to {
    transform: rotate(360deg);
  }
}
</style>
