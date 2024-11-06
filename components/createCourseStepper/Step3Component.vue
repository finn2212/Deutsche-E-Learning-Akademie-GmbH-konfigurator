<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">Step 3: Variable Kurs Daten</h3>
    <form @submit.prevent="submitForm">
      <!-- Existing form elements -->
      <!-- Name input field -->
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700">Course Name</label>
        <input v-model="form.name" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Course Name" />
      </div>
      <!-- Titles input fields -->
      <div class="mb-4">
        <label for="titles" class="block text-sm font-medium text-gray-700">Titles</label>
        <div class="mt-1">
          <div v-for="(title, index) in form.titles" :key="index" class="flex items-center mb-2">
            <input v-model="form.titles[index]" type="text" required class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter Title" />
            <button type="button" @click="removeTitle(index)" class="ml-2 font-semibold text-indigo-600 hover:text-indigo-500">Remove</button>
          </div>
          <button type="button" @click="addTitle" class="mt-2 font-semibold text-indigo-600 hover:text-indigo-500">Add Title</button>
        </div>
      </div>
      <!-- Types input fields -->
      <div class="mb-4">
        <label for="types" class="block text-sm font-medium text-gray-700">Types</label>
        <div class="mt-1">
          <div v-for="(type, index) in form.types" :key="index" class="flex items-center mb-2">
            <Dropdown v-model="form.types[index]" :options="typeDropdownOptions" />
            <button type="button" @click="removeType(index)" class="ml-2 font-semibold text-indigo-600 hover:text-indigo-500">Remove</button>
          </div>
          <button type="button" @click="addType" class="mt-2 font-semibold text-indigo-600 hover:text-indigo-500">Add Type</button>
        </div>
      </div>
      <!-- Locations input fields -->
      <div class="mb-4">
        <label for="locations" class="block text-sm font-medium text-gray-700">Locations</label>
        <div class="mt-1">
          <div v-for="(locationId, index) in form.location_ids" :key="index" class="flex items-center mb-2">
            <Dropdown v-model="form.location_ids[index]" :options="locationDropdownOptions" />
            <button type="button" @click="removeLocation(index)" class="ml-2 font-semibold text-indigo-600 hover:text-indigo-500">Remove</button>
          </div>
          <button type="button" @click="addLocation" class="mt-2 font-semibold text-indigo-600 hover:text-indigo-500">Add Location</button>
        </div>
      </div>
      <!-- Start times input fields -->
      <div class="mb-4">
        <label for="startTimes" class="block text-sm font-medium text-gray-700">Start Times</label>
        <div class="mt-1">
          <div v-for="(timeId, index) in form.start_time_ids" :key="index" class="flex items-center mb-2">
            <Dropdown v-model="form.start_time_ids[index]" :options="startTimeDropdownOptions" />
            <button type="button" @click="removeStartTime(index)" class="ml-2 font-semibold text-indigo-600 hover:text-indigo-500">Remove</button>
          </div>
          <button type="button" @click="addStartTime" class="mt-2 font-semibold text-indigo-600 hover:text-indigo-500">Add Start Time</button>
        </div>
      </div>
      <!-- Dates input fields -->
      <div class="mb-4">
        <label for="dates" class="block text-sm font-medium text-gray-700">Dates</label>
        <div class="mt-1">
          <div v-for="(dateId, index) in form.dates_ids" :key="index" class="flex items-center mb-2">
            <Dropdown v-model="form.dates_ids[index]" :options="dateDropdownOptions" />
            <button type="button" @click="removeDate(index)" class="ml-2 font-semibold text-indigo-600 hover:text-indigo-500">Remove</button>
          </div>
          <button type="button" @click="addDate" class="mt-2 font-semibold text-indigo-600 hover:text-indigo-500">Add Date</button>
        </div>
      </div>
      <!-- Form action buttons -->
      <div class="flex justify-end sticky bottom-0 bg-white py-4">
        <button type="button" @click="prevStep" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Back</button>
        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Save</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useNuxtApp } from '#app'
import Dropdown from '@/components/layouts/Dropdown.vue'
import { format } from 'date-fns'

const props = defineProps({
  course: Object,
  selectedCourseType: String // Receive the selected course type from Step 2
})

const emit = defineEmits(['prevStep', 'close', 'add-course', 'course-saved'])
const { $supabase } = useNuxtApp()

const form = ref({
  name: '',
  titles: [''],
  types: [],
  location_ids: [],
  start_time_ids: [],
  dates_ids: [],
  course_type: props.selectedCourseType // Initialize with selected course type
})

const typeOptions = ref([])
const locationOptions = ref([])
const startTimeOptions = ref([])
const dateOptions = ref([])

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

const fetchLocations = async () => {
  const { data, error } = await $supabase
    .from('places')
    .select('*')

  if (!error && data) {
    locationOptions.value = data
    if (!form.value.location_ids.length && locationOptions.value.length) {
      form.value.location_ids.push(locationOptions.value[0].id)
    }
  } else {
    console.error(error)
  }
}

const fetchStartTimes = async () => {
  const { data, error } = await $supabase
    .from('start_times')
    .select('*')

  if (!error && data) {
    startTimeOptions.value = data
    if (!form.value.start_time_ids.length && startTimeOptions.value.length) {
      form.value.start_time_ids.push(startTimeOptions.value[0].id)
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

const addTitle = () => {
  form.value.titles.push('')
}

const removeTitle = (index) => {
  form.value.titles.splice(index, 1)
}

const addType = () => {
  form.value.types.push(typeOptions.value[0]?.name || 'Vollzeit')
}

const removeType = (index) => {
  form.value.types.splice(index, 1)
}

const addLocation = () => {
  form.value.location_ids.push(locationOptions.value[0]?.id || '')
}

const removeLocation = (index) => {
  form.value.location_ids.splice(index, 1)
}

const addStartTime = () => {
  form.value.start_time_ids.push(startTimeOptions.value[0]?.id || '')
}

const removeStartTime = (index) => {
  form.value.start_time_ids.splice(index, 1)
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

const locationDropdownOptions = computed(() =>
  locationOptions.value.map(option => ({ value: option.id, label: option.name }))
)

const startTimeDropdownOptions = computed(() =>
  startTimeOptions.value.map(option => ({ value: option.id, label: option.time }))
)

const dateDropdownOptions = computed(() =>
  dateOptions.value.map(option => ({ value: option.id, label: `${format(new Date(option.start_date), 'dd.MM.yyyy')} - ${format(new Date(option.end_date), 'dd.MM.yyyy')}` }))
)

watch(() => props.course, (newCourse) => {
  if (newCourse) {
    form.value = {
      name: newCourse.name || '',
      titles: newCourse.titles || [''],
      types: newCourse.types || [],
      location_ids: newCourse.location_ids || [],
      start_time_ids: newCourse.start_time_ids || [],
      dates_ids: newCourse.dates_ids || [],
      course_type: props.course.course_type // Ensure this value is included
    }
  } else {
    form.value = { name: '', titles: [''], types: [], location_ids: [], start_time_ids: [], dates_ids: [], course_type: props.selectedCourseType }
  }
}, { immediate: true })

const prevStep = () => {
  emit('prevStep')
}

const submitForm = async () => {
  debugger
  const { course_type, dates_ids, location_ids, name, start_time_ids, titles, types } = form.value;

  // Create combinations for each unique entry
  const allCombinations = [];
  dates_ids.forEach(dateId => {
    location_ids.forEach(locationId => {
      start_time_ids.forEach(startTimeId => {
        types.forEach(type => {
          allCombinations.push({
            course_type,
            date_id: dateId,
            location_id: locationId,
            name,
            start_time_id: startTimeId,
            title: titles[0],  // Assuming one title per course
            type
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
    emit('all-termine-saved', data); // Emit event for successful save
  }

  emit('close');
};


// const submitForm = async () => {
//   if (props.course && props.course.id) {

//     debugger;
//     // Edit existing course
//     const { data, error } = await $supabase
//       .from('courses')
//       .update({ ...form.value })
//       .eq('id', props.course.id)
//       .select()

//     if (!error && data) {
//       emit('add-course', data[0])
//       emit('course-saved')
//     } else {
//       console.error(error)
//     }
//   } else {
//     // Add new course
//     const { data, error } = await $supabase
//       .from('courses')
//       .insert([{ ...form.value }])
//       .select()

//     if (!error && data) {
//       emit('add-course', data[0])
//       emit('course-saved')
//     } else {
//       console.error(error)
//     }
//   }
//   emit('close')
// }

onMounted(() => {
  fetchTypes()
  fetchLocations()
  fetchStartTimes()
  fetchDates()
})
</script>

