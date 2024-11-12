<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-md shadow-md max-h-screen overflow-y-auto" :style="{ maxHeight: `calc(100vh - 80px)`, paddingTop: '20px', marginTop: '50px' }">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ isEditMode ? 'Kurstyp bearbeiten' : 'Kurstyp hinzufügen' }}</h2>
        <button @click="closeForm" class="text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div class="mb-4">
            <label for="type" class="block text-sm font-medium text-gray-700">Type</label>
            <input v-model="form.type" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Type" />
          </div>
          <div class="mb-4">
            <label for="course_type" class="block text-sm font-medium text-gray-700">Kurs Type</label>
            <input v-model="form.course_type" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Course Type" />
          </div>
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input v-model="form.title" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Title" />
          </div>
          <div class="mb-4">
            <label for="description_long" class="block text-sm font-medium text-gray-700">Description Long</label>
            <textarea v-model="form.description_long" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Description"></textarea>
          </div>
          <div class="mb-4">
            <label for="requirements" class="block text-sm font-medium text-gray-700">Requirements</label>
            <textarea v-model="form.requirements" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Requirements"></textarea>
          </div>
          <div class="mb-4">
            <label for="keywords_group" class="block text-sm font-medium text-gray-700">Keywords Group</label>
            <textarea v-model="form.keywords_group" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Keywords Group"></textarea>
          </div>
          <div class="mb-4">
            <label for="target_group_text" class="block text-sm font-medium text-gray-700">Target Group Text</label>
            <textarea v-model="form.target_group_text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Target Group Text"></textarea>
          </div>
          <div class="mb-4">
            <label for="degree_type1" class="block text-sm font-medium text-gray-700">Degree Type 1</label>
            <input v-model="form.degree_type1" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Degree Type 1" />
          </div>
          <div class="mb-4">
            <label for="degree_title" class="block text-sm font-medium text-gray-700">Degree Title</label>
            <input v-model="form.degree_title" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Degree Title" />
          </div>
          <div class="mb-4">
            <label for="degree_type2" class="block text-sm font-medium text-gray-700">Degree Type 2</label>
            <input v-model="form.degree_type2" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Degree Type 2" />
          </div>
          <div class="mb-4">
            <label for="examiner" class="block text-sm font-medium text-gray-700">Examiner</label>
            <input v-model="form.examiner" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Examiner" />
          </div>
          <div class="mb-4">
            <label for="degree_add_qualification" class="block text-sm font-medium text-gray-700">Degree Add Qualification</label>
            <input v-model="form.degree_add_qualification" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Degree Add Qualification" />
          </div>
          <div class="mb-4">
            <label for="degree_entitled" class="block text-sm font-medium text-gray-700">Degree Entitled</label>
            <input v-model="form.degree_entitled" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Degree Entitled" />
          </div>
          <div class="mb-4">
            <label for="subsidy_description" class="block text-sm font-medium text-gray-700">Subsidy Description</label>
            <textarea v-model="form.subsidy_description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Subsidy Description"></textarea>
          </div>
          <div class="mb-4">
            <label for="instruction_form" class="block text-sm font-medium text-gray-700">Instruction Form</label>
            <textarea v-model="form.instruction_form" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Instruction Form"></textarea>
          </div>
          <div class="mb-4">
            <label for="instruction_type1" class="block text-sm font-medium text-gray-700">Instruction Type 1</label>
            <input v-model="form.instruction_type1" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Instruction Type 1" />
          </div>
          <div class="mb-4">
            <label for="instruction_type2" class="block text-sm font-medium text-gray-700">Instruction Type 2</label>
            <input v-model="form.instruction_type2" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Instruction Type 2" />
          </div>
          <div class="mb-4">
            <label for="inhouse_seminar" class="block text-sm font-medium text-gray-700">Inhouse Seminar</label>
            <input v-model="form.inhouse_seminar" type="checkbox" class="mt-1 block" />
          </div>
          <div class="mb-4">
            <label for="extra_occupational" class="block text-sm font-medium text-gray-700">Extra Occupational</label>
            <input v-model="form.extra_occupational" type="checkbox" class="mt-1 block" />
          </div>
          <div class="mb-4">
            <label for="practical_part" class="block text-sm font-medium text-gray-700">Practical Part</label>
            <input v-model="form.practical_part" type="checkbox" class="mt-1 block" />
          </div>
          <div class="mb-4">
            <label for="education_type1" class="block text-sm font-medium text-gray-700">Education Type 1</label>
            <input v-model="form.education_type1" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Education Type 1" />
          </div>
          <div class="mb-4">
            <label for="education_type2" class="block text-sm font-medium text-gray-700">Education Type 2</label>
            <input v-model="form.education_type2" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Education Type 2" />
          </div>
          <div class="mb-4">
            <label for="duration_type" class="block text-sm font-medium text-gray-700">Duration Type</label>
            <input v-model="form.duration_type" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Duration Type" />
          </div>
          <div class="mb-4">
            <label for="flexible_start" class="block text-sm font-medium text-gray-700">Flexible Start</label>
            <input v-model="form.flexible_start" type="checkbox" class="mt-1 block" />
          </div>
          <div class="mb-4">
            <label for="segment_type2" class="block text-sm font-medium text-gray-700">Segment Type 2</label>
            <input v-model="form.segment_type2" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Segment Type 2" />
          </div>
          <div class="mb-4">
            <label for="reference_classification_system_name" class="block text-sm font-medium text-gray-700">Reference Classification System Name</label>
            <input v-model="form.reference_classification_system_name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Reference Classification System Name" />
          </div>
          <div class="mb-4">
            <label for="fname" class="block text-sm font-medium text-gray-700">FNAME</label>
            <input v-model="form.fname" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter FNAME" />
          </div>
          <div class="mb-4">
            <label for="fvalue" class="block text-sm font-medium text-gray-700">FVALUE</label>
            <input v-model="form.fvalue" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter FVALUE" />
          </div>
          <div class="mb-4">
            <label for="price_amount" class="block text-sm font-medium text-gray-700">Price Amount</label>
            <input v-model="form.price_amount" type="number" step="0.01" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Price Amount" />
          </div>
          <div class="mb-4">
            <label for="price_currency" class="block text-sm font-medium text-gray-700">Price Currency</label>
            <input v-model="form.price_currency" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Price Currency" />
          </div>
          <div class="mb-4">
            <label for="measure_numbery" class="block text-sm font-medium text-gray-700">Measure Number</label>
            <input v-model="form.measure_number" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Measure Number" />
          </div>
        </div>
        <div class="mb-4">
            <label for="Manuelle Id" class="block text-sm font-medium text-gray-700">Manuelle Kurs Id</label>
            <input v-model="form.manual_id" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Manuelle id" />
        </div>
        <div class="flex justify-end sticky bottom-0 bg-white py-4">
          <button type="button" @click="closeForm" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  courseType: Object,
  closeForm: Function,
  saveCourseType: Function,
  isEditMode: Boolean
})

const form = ref({
  type: '',
  course_type: '',
  title: '',
  description_long: '',
  requirements: '',
  keywords_group: '',
  target_group_text: '',
  degree_type1: '',
  degree_title: '',
  degree_type2: '',
  examiner: '',
  degree_add_qualification: '',
  degree_entitled: '',
  subsidy_description: '',
  instruction_form: '',
  instruction_type1: '',
  instruction_type2: '',
  inhouse_seminar: false,
  extra_occupational: false,
  practical_part: false,
  education_type1: '',
  education_type2: '',
  duration_type: '',
  flexible_start: false,
  segment_type2: '',
  reference_classification_system_name: '',
  fname: '',
  fvalue: '',
  price_amount: 0,
  price_currency: 'EUR',
  measure_number: '',
  manual_id:'',
})

watch(() => props.courseType, (newCourseType) => {
  if (newCourseType) {
    form.value = { ...newCourseType }
  } else {
    form.value = {
      type: '',
      course_type: '',
      title: '',
      description_long: '',
      requirements: '',
      keywords_group: '',
      target_group_text: '',
      degree_type1: '',
      degree_title: '',
      degree_type2: '',
      examiner: '',
      degree_add_qualification: '',
      degree_entitled: '',
      subsidy_description: '',
      instruction_form: '',
      instruction_type1: '',
      instruction_type2: '',
      inhouse_seminar: false,
      extra_occupational: false,
      practical_part: false,
      education_type1: '',
      education_type2: '',
      duration_type: '',
      flexible_start: false,
      segment_type2: '',
      reference_classification_system_name: '',
      fname: '',
      fvalue: '',
      price_amount: 0,
      price_currency: 'EUR',
      measure_number: '',
      manual_id: ''
    }
  }
}, { immediate: true })

const submitForm = () => {
  props.saveCourseType(form.value)
}
</script>

<style scoped>
/* Add any additional styles here if necessary */
</style>
