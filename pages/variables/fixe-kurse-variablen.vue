<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold mb-4">Kurs Typen</h1>
        <p>Manage your fixed course variables here.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button @click="openAddCourseTypeForm" type="button" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add Course Type</button>
      </div>
    </div>

    <!-- Course Types Grid -->
    <div v-if="loading" class="text-center">
      <!-- Loading state -->
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Loading Course Types...</h3>
    </div>
    <div v-else-if="courseTypes.length === 0" class="text-center">
      <!-- No Course Types state -->
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No Course Types</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new course type.</p>
    </div>
    <div v-else class="mt-8 flow-root">
      <!-- Grid of Course Types -->
      <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <li v-for="courseType in courseTypes" :key="courseType.id" class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow relative">
          <div class="flex flex-1 flex-col p-8 text-left">
            <h3 class="text-sm font-medium text-gray-900">Title: {{ courseType.title }}</h3>
            <p class="text-sm text-gray-500 mt-2">Description: {{ courseType.description_long }}</p>
            <p class="text-sm text-gray-500 mt-2">Requirements: {{ courseType.requirements }}</p>
            <p class="text-sm text-gray-500 mt-2">Keywords Group: {{ courseType.keywords_group }}</p>
            <p class="text-sm text-gray-500 mt-2">Target Group Text: {{ courseType.target_group_text }}</p>
            <p class="text-sm text-gray-500 mt-2">Degree Type 1: {{ courseType.degree_type1 }}</p>
            <p class="text-sm text-gray-500 mt-2">Degree Title: {{ courseType.degree_title }}</p>
            <p class="text-sm text-gray-500 mt-2">Degree Type 2: {{ courseType.degree_type2 }}</p>
            <p class="text-sm text-gray-500 mt-2">Examiner: {{ courseType.examiner }}</p>
            <p class="text-sm text-gray-500 mt-2">Degree Add Qualification: {{ courseType.degree_add_qualification }}</p>
            <p class="text-sm text-gray-500 mt-2">Degree Entitled: {{ courseType.degree_entitled }}</p>
            <p class="text-sm text-gray-500 mt-2">Subsidy Description: {{ courseType.subsidy_description }}</p>
            <p class="text-sm text-gray-500 mt-2">Instruction Form: {{ courseType.instruction_form }}</p>
            <p class="text-sm text-gray-500 mt-2">Instruction Type 1: {{ courseType.instruction_type1 }}</p>
            <p class="text-sm text-gray-500 mt-2">Instruction Form Name: {{ courseType.instruction_form_name }}</p>
            <p class="text-sm text-gray-500 mt-2">Instruction Type 2: {{ courseType.instruction_type2 }}</p>
            <p class="text-sm text-gray-500 mt-2">Inhouse Seminar: {{ courseType.inhouse_seminar }}</p>
            <p class="text-sm text-gray-500 mt-2">Extra Occupational: {{ courseType.extra_occupational }}</p>
            <p class="text-sm text-gray-500 mt-2">Practical Part: {{ courseType.practical_part }}</p>
            <p class="text-sm text-gray-500 mt-2">Education Type 1: {{ courseType.education_type1 }}</p>
            <p class="text-sm text-gray-500 mt-2">Education Type 2: {{ courseType.education_type2 }}</p>
            <p class="text-sm text-gray-500 mt-2">Duration Type: {{ courseType.duration_type }}</p>
            <p class="text-sm text-gray-500 mt-2">Flexible Start: {{ courseType.flexible_start }}</p>
            <p class="text-sm text-gray-500 mt-2">Segment Type 2: {{ courseType.segment_type2 }}</p>
            <p class="text-sm text-gray-500 mt-2">Reference Classification System Name: {{ courseType.reference_classification_system_name }}</p>
            <p class="text-sm text-gray-500 mt-2">FNAME: {{ courseType.fname }}</p>
            <p class="text-sm text-gray-500 mt-2">FVALUE: {{ courseType.fvalue }}</p>
            <p class="text-sm text-gray-500 mt-2">Price Amount: {{ courseType.price_amount }}</p>
          </div>
          <div>
            <div class="-mt-px flex divide-x divide-gray-200">
              <div class="flex w-0 flex-1">
                <button @click="editCourseType(courseType)" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                  <span>Edit</span>
                </button>
              </div>
              <div class="-ml-px flex w-0 flex-1">
                <button @click="deleteCourseType(courseType.id)" class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Add Course Type Form Modal -->
    <div v-if="showAddCourseTypeForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <CourseTypeForm :courseType="currentCourseType" :closeForm="closeAddCourseTypeForm" :saveCourseType="saveCourseType" :isEditMode="isEditMode" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import CourseTypeForm from '~/components/CourseTypeForm.vue'

const { $supabase } = useNuxtApp()
const courseTypes = ref([])
const currentCourseType = ref(null)
const loading = ref(true)
const showAddCourseTypeForm = ref(false)
const isEditMode = ref(false)

const openAddCourseTypeForm = () => {
  showAddCourseTypeForm.value = true
  isEditMode.value = false
  currentCourseType.value = null
}

const closeAddCourseTypeForm = () => {
  showAddCourseTypeForm.value = false
  currentCourseType.value = null
  isEditMode.value = false
}

const addCourseType = async (courseType) => {
  const { data, error } = await $supabase
    .from('course_types')
    .insert([courseType])
    .select()

  if (!error && data) {
    getCourseTypes()
  } else {
    console.error(error)
  }
}

const updateCourseType = async (courseType) => {
  const { data, error } = await $supabase
    .from('course_types')
    .update(courseType)
    .eq('id', courseType.id)
    .select()

  if (!error && data) {
    getCourseTypes()
  } else {
    console.error(error)
  }
}

const saveCourseType = (courseType) => {
  if (isEditMode.value) {
    updateCourseType(courseType)
  } else {
    addCourseType(courseType)
  }
  closeAddCourseTypeForm()
}

const editCourseType = (courseType) => {
  currentCourseType.value = { ...courseType }
  showAddCourseTypeForm.value = true
  isEditMode.value = true
}

const deleteCourseType = async (courseTypeId) => {
  await $supabase
    .from('course_types')
    .delete()
    .eq('id', courseTypeId)

  getCourseTypes()
}

const getCourseTypes = async () => {
  const { data, error } = await $supabase
    .from('course_types')
    .select('*')

  if (!error && data) {
    courseTypes.value = data
  } else {
    console.error(error)
  }
  loading.value = false
}

onMounted(() => {
  getCourseTypes()
})
</script>

<style>
/* Loading spinner styles */
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
