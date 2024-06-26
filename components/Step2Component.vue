<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">Step 2: Kurs Spezifische Fix Daten</h3>
    <form @submit.prevent="nextStep">
      <div class="mb-4">
        <label for="course_type" class="block text-sm font-medium text-gray-700">Course Type</label>
        <select v-model="selectedCourseType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option v-for="type in courseTypes" :key="type.id" :value="type.id">{{ type.title }}</option>
        </select>
      </div>
      <!-- Preview section -->
      <div v-if="selectedCourseTypeDetails" class="mb-4 p-4 border rounded-md shadow-sm bg-gray-50">
        <h4 class="text-lg font-semibold mb-2">Course Type Details</h4>
        <p><strong>Title:</strong> {{ selectedCourseTypeDetails.title }}</p>
        <p><strong>Description:</strong> {{ selectedCourseTypeDetails.description_long }}</p>
        <p><strong>Requirements:</strong> {{ selectedCourseTypeDetails.requirements }}</p>
        <p><strong>Keywords Group:</strong> {{ selectedCourseTypeDetails.keywords_group }}</p>
        <p><strong>Target Group Text:</strong> {{ selectedCourseTypeDetails.target_group_text }}</p>
        <p><strong>Degree Type 1:</strong> {{ selectedCourseTypeDetails.degree_type1 }}</p>
        <p><strong>Degree Title:</strong> {{ selectedCourseTypeDetails.degree_title }}</p>
        <p><strong>Degree Type 2:</strong> {{ selectedCourseTypeDetails.degree_type2 }}</p>
        <p><strong>Examiner:</strong> {{ selectedCourseTypeDetails.examiner }}</p>
        <p><strong>Degree Add Qualification:</strong> {{ selectedCourseTypeDetails.degree_add_qualification }}</p>
        <p><strong>Degree Entitled:</strong> {{ selectedCourseTypeDetails.degree_entitled }}</p>
        <p><strong>Subsidy Description:</strong> {{ selectedCourseTypeDetails.subsidy_description }}</p>
        <p><strong>Instruction Form:</strong> {{ selectedCourseTypeDetails.instruction_form }}</p>
        <p><strong>Instruction Type 1:</strong> {{ selectedCourseTypeDetails.instruction_type1 }}</p>
        <p><strong>Instruction Form Name:</strong> {{ selectedCourseTypeDetails.instruction_form_name }}</p>
        <p><strong>Instruction Type 2:</strong> {{ selectedCourseTypeDetails.instruction_type2 }}</p>
        <p><strong>Inhouse Seminar:</strong> {{ selectedCourseTypeDetails.inhouse_seminar ? 'Yes' : 'No' }}</p>
        <p><strong>Extra Occupational:</strong> {{ selectedCourseTypeDetails.extra_occupational ? 'Yes' : 'No' }}</p>
        <p><strong>Practical Part:</strong> {{ selectedCourseTypeDetails.practical_part ? 'Yes' : 'No' }}</p>
        <p><strong>Education Type 1:</strong> {{ selectedCourseTypeDetails.education_type1 }}</p>
        <p><strong>Education Type 2:</strong> {{ selectedCourseTypeDetails.education_type2 }}</p>
        <p><strong>Duration Type:</strong> {{ selectedCourseTypeDetails.duration_type }}</p>
        <p><strong>Flexible Start:</strong> {{ selectedCourseTypeDetails.flexible_start ? 'Yes' : 'No' }}</p>
        <p><strong>Segment Type 2:</strong> {{ selectedCourseTypeDetails.segment_type2 }}</p>
        <p><strong>Reference Classification System Name:</strong> {{ selectedCourseTypeDetails.reference_classification_system_name }}</p>
        <p><strong>FNAME:</strong> {{ selectedCourseTypeDetails.fname }}</p>
        <p><strong>FVALUE:</strong> {{ selectedCourseTypeDetails.fvalue }}</p>
        <p><strong>Price Amount:</strong> {{ selectedCourseTypeDetails.price_amount }}</p>
      </div>
      <div class="flex justify-end sticky bottom-0 bg-white py-4">
        <button type="button" @click="prevStep" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Back</button>
        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Next</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const props = defineProps({
  course: Object
})
const emit = defineEmits(['prevStep', 'nextStep'])
const selectedCourseType = ref(null)
const selectedCourseTypeDetails = ref(null)
const courseTypes = ref([])
const { $supabase } = useNuxtApp()

const fetchCourseTypes = async () => {
  const { data, error } = await $supabase
    .from('course_types')
    .select('*')
  
  if (data) {
    courseTypes.value = data
    if (courseTypes.value.length > 0) {
      selectedCourseType.value = courseTypes.value[0].id
    }
  } else {
    console.error(error)
  }
}

const nextStep = () => {
  if (selectedCourseType.value) {
    emit('nextStep', selectedCourseType.value)
  }
}

const prevStep = () => {
  emit('prevStep')
}

watch(selectedCourseType, (newCourseTypeId) => {
  if (newCourseTypeId) {
    selectedCourseTypeDetails.value = courseTypes.value.find(type => type.id === newCourseTypeId)
  } else {
    selectedCourseTypeDetails.value = null
  }
})

onMounted(() => {
  fetchCourseTypes()
})
</script>
