<template>
  <div>
    <!-- Back button to go back to the main view -->
    <button @click="$emit('goBack')"
      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">Back</button>

    <!-- Page title -->
    <h2 class="text-xl font-semibold mb-4">Configure BSH Termine</h2>

    <!-- Form or configuration fields for BSH Termine -->
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label for="titles" class="block text-sm font-medium text-gray-700">Kurs Typ</label>
        <div class="mt-1">
          <Dropdown v-model="form.course_type" :options="courseTypeOptions" />
        </div>

      </div>
      <!-- TeachingTypes Types Dropdown -->
      <div class="mb-4">
        <label for="teachingTypes" class="block text-sm font-medium text-gray-700">Unterrichtsform*</label>
        <select v-model="selectedTeachingForm" @change="updateTeachingForms"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
          <option value="" disabled>Select Education Type</option>
          <option v-for="teachingType in teachingForms" :key="teachingType.id" :value="teachingType.id">{{
            teachingType.text }}</option>
        </select>
      </div>
      <!-- Types input fields -->
      <div class="mb-4">
        <label for="types" class="block text-sm font-medium text-gray-700">Types</label>
        <div class="mt-1">
          <div v-for="(type, index) in form.types" :key="index" class="flex items-center mb-2">
            <Dropdown v-model="form.types[index]" :options="typeDropdownOptions" />
            <button type="button" @click="removeType(index)"
              class="ml-2 font-semibold text-indigo-600 hover:text-indigo-500">Remove</button>
          </div>
          <button type="button" @click="addType" class="mt-2 font-semibold text-indigo-600 hover:text-indigo-500">Add
            Type</button>
        </div>
      </div>
      <div class="mb-4">
        <label for="locations" class="block text-sm font-medium text-gray-700">Locations</label>
        <div class="mt-1">
          <Multiselect v-model="form.location_ids" @update:model-value="onChangeLocations"
            :options="locationDropdownWithSelectAll" :multiple="true" :close-on-select="false"
            placeholder="Select Locations" label="label" track-by="value" class="w-full" />
        </div>
      </div>
      <div class="mb-4">
  <label for="timeRanges" class="block text-sm font-medium text-gray-700">Kurs Zeiten</label>
  <div class="mt-1">
    <!-- Existing Time Ranges -->
    <div v-if="form.timeRanges.length === 0" class="text-gray-500 text-sm mb-2">
      Noch keine Zeiten Hinzugefügt.
    </div>
    <div v-for="(time, index) in form.timeRanges" :key="index" class="flex items-center mb-2">
      <span class="block w-32">{{ time.start_time }}</span>
      <span class="mx-2 text-gray-600">Bis</span>
      <span class="block w-32">{{ time.end_time }}</span>
      <button type="button" @click="removeTimeRange(index)"
        class="ml-2 font-semibold text-indigo-600 hover:text-indigo-500">Entfernen</button>
    </div>

    <!-- New Time Range Inputs -->
    <div class="flex items-center mb-4">
      <input v-model="newTimeRange.start_time" @change="validateAndAddTimeRange" type="time"
        class="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      <span class="mx-2 text-gray-600">Bis</span>
      <input v-model="newTimeRange.end_time" @change="validateAndAddTimeRange" type="time"
        class="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>

    <!-- Validation Message -->
    <p v-if="timeValidationError" class="text-sm text-red-500">{{ timeValidationError }}</p>
  </div>
</div>




      <!-- Dates input fields -->
      <div class="mb-4">
        <label for="dates" class="block text-sm font-medium text-gray-700">Dates</label>
        <div class="mt-1">
          <div v-for="(dateId, index) in form.dates_ids" :key="index" class="flex items-center mb-2">
            <Dropdown v-model="form.dates_ids[index]" :options="dateDropdownOptions" />
            <button type="button" @click="removeDate(index)"
              class="ml-2 font-semibold text-indigo-600 hover:text-indigo-500">Remove</button>
          </div>
          <button type="button" @click="addDate" class="mt-2 font-semibold text-indigo-600 hover:text-indigo-500">Add
            Date</button>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end">
        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useNuxtApp } from '#app'
import { format } from 'date-fns'
import Dropdown from '@/components/layouts/Dropdown.vue'
import { useReferenceData } from '@/composables/useReferenceData';
import 'vue-multiselect/dist/vue-multiselect.css'

const emit = defineEmits(['goBack', 'config-saved']);

const props = defineProps({
  course: Object,
  selectedCourseType: String // Receive the selected course type from Step 2
})

const { $supabase } = useNuxtApp()
const { fetchTeachingForms } = useReferenceData();

// Reactive form data object
const form = ref({
  name: '',
  titles: [''],
  course_types: [],
  types: [],
  location_ids: [],
  start_time_ids: [],
  dates_ids: [],
  timeRanges: [],
  course_type: props.selectedCourseType // Initialize with selected course type
})

const typeOptions = ref([])
const locationOptions = ref([])
const dateOptions = ref([])
const course_types = ref([])
const selectedTeachingForm = ref("")
const teachingForms = ref([]);
const timeValidationError = ref('');
const newTimeRange = ref({ start_time: '', end_time: '' });
const validateAndAddTimeRange = () => {
  const { start_time, end_time } = newTimeRange.value;

  // Clear previous validation error
  timeValidationError.value = '';

  // Validation
  if (!start_time || !end_time) {
    // Do nothing if either time is missing
    return;
  }
  if (start_time >= end_time) {
    timeValidationError.value = 'Bitte wählen Sie eine korrekte Endzeit aus.';
    return;
  }

  // Add to form array
  form.value.timeRanges.push({ start_time, end_time });

  // Reset the local ref
  newTimeRange.value = { start_time: '', end_time: '' };
};

const removeTimeRange = (index) => {
  form.value.timeRanges.splice(index, 1);
};

const fetchTypes = async () => {
  const { data, error } = await $supabase
    .from('timeframes')
    .select('*')

  if (!error && data) {
    typeOptions.value = data
    if (!form.value.types.length && typeOptions.value.length) {
      form.value.types.push(typeOptions.value[0].name)
    }
  } else {
    console.error(error)
  }
}

const fetchCourse_types = async () => {
  const { data, error } = await $supabase
    .from('course_types')
    .select('*')

  if (!error && data) {
    course_types.value = data
    if (!form.value.course_types.length && course_types.value.length) {
      form.value.types.push(course_types.value[0].name)
    }
  } else {
    console.error(error)
  }
}

const fetchLocations = async () => {
  const { data, error } = await $supabase
    .from('places')
    .select('*')

  if (!error && data) {
    locationOptions.value = data
    if (!form.value.location_ids.length && locationOptions.value.length) {
      form.value.location_ids.push({ value: locationOptions.value[0].id, label: locationOptions.value[0].name })
    }
  } else {
    console.error(error)
  }
}

const fetchDates = async () => {
  const { data, error } = await $supabase
    .from('dates')
    .select('*')

  if (!error && data) {
    dateOptions.value = data
    if (!form.value.dates_ids.length && dateOptions.value.length) {
      form.value.dates_ids.push(dateOptions.value[0].id)
    }
  } else {
    console.error(error)
  }
}

const addType = () => {
  form.value.types.push(typeOptions.value[0]?.name || 'Vollzeit')
}

const removeType = (index) => {
  form.value.types.splice(index, 1)
}

const addDate = () => {
  form.value.dates_ids.push(dateOptions.value[0]?.id || '')
}

const removeDate = (index) => {
  form.value.dates_ids.splice(index, 1)
}

const typeDropdownOptions = computed(() =>
  typeOptions.value.map(option => ({ value: option.name, label: option.name }))
)

const courseTypeOptions = computed(() =>
  course_types.value.map(option => ({ value: option.id, label: option.title }))
);
const dateDropdownOptions = computed(() =>
  dateOptions.value.map(option => ({ value: option.id, label: `${format(new Date(option.start_date), 'dd.MM.yyyy')} - ${format(new Date(option.end_date), 'dd.MM.yyyy')}` }))
)


const submitForm = async () => {
  const { course_type, dates_ids, location_ids, name, timeRanges, titles, types } = form.value;
  debugger

  // Create combinations for each unique entry
  const allCombinations = [];
  const selectedTeaching = teachingForms.value.find(item => item.id === selectedTeachingForm.value);
  const instruction_type1 = selectedTeaching ? selectedTeaching.id : '';
  const instruction_form = selectedTeaching ? selectedTeaching.text : '';
  dates_ids.forEach(dateId => {
    location_ids.forEach(locationId => {
      timeRanges.forEach(time => {
        types.forEach(type => {
          allCombinations.push({
            course_type,
            date_id: dateId,
            location_id: locationId.value,
            name,
            start_time: time.start_time,
            end_time: time.end_time,
            title: course_types.value.find((entry) => entry.id === course_type).title,  // Assuming one title per course
            type,
            instruction_type1,
            instruction_form
          });
        });
      });
    });
  });

  // Insert each combination into the 'all_termine' table
  const { data, error } = await $supabase
    .from('all_termine')
    .insert(allCombinations)
    .select();

  if (error) {
    console.error("Error inserting combinations:", error);
  } else {
    console.log("Inserted combinations:", data);
    emit('goBack');
  }
};

// Handle changes in the multi-select
const onChangeLocations = (selectedValues) => {
  if (selectedValues.some(item => item.value === 'all')) {
    // If "Select All" is selected
    if (selectedValues.length === 1 || selectedValues.length - 1 < locationOptions.value.length) {
      // Select all items
      form.value.location_ids = locationOptions.value.map(location => ({
        value: location.id,
        label: location.name
      }));
    } else {
      // Deselect all items
      form.value.location_ids = []
    }
  } else {
    // Regular selection logic
    form.value.location_ids = selectedValues
  }

  console.log('Selected Locations:', form.value.location_ids)
}
// Prepend "Select All" option
const locationDropdownWithSelectAll = computed(() => [
  { value: 'all', label: 'Alle Auswählen' }, // Select All option
  ...locationOptions.value.map(option => ({
    value: option.id,
    label: option.name
  }))
])


onMounted(async () => {
  await fetchTypes()
  await fetchLocations()
  await fetchDates()
  await fetchCourse_types()
  teachingForms.value = await fetchTeachingForms();

})
</script>

<style scoped>
/* Optional: Add any specific styles for this component */
</style>