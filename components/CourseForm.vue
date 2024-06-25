<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white p-6 rounded-md shadow-md max-h-screen overflow-y-auto">
      <h2 class="text-xl font-semibold mb-4">{{ course && course.id ? 'Edit Course' : 'Add Course' }}</h2>
      <div class="overflow-y-auto max-h-[70vh]">
        <form @submit.prevent="submitForm">
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
          <!-- Form action buttons -->
          <div class="flex justify-end sticky bottom-0 bg-white py-4">
            <button type="button" @click="$emit('close')" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useNuxtApp } from '#app'
import Dropdown from '@/components/Dropdown.vue'

const props = defineProps({
  course: Object
})

const emit = defineEmits(['close', 'add-course', 'course-saved'])
const { $supabase } = useNuxtApp()

const form = ref({
  name: '',
  titles: [''],
  types: [],
  location_ids: [],
  start_time_ids: []
})

const typeOptions = ref([])
const locationOptions = ref([])
const startTimeOptions = ref([])

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

const typeDropdownOptions = computed(() =>
  typeOptions.value.map(option => ({ value: option.name, label: option.name }))
)

const locationDropdownOptions = computed(() =>
  locationOptions.value.map(option => ({ value: option.id, label: option.name }))
)

const startTimeDropdownOptions = computed(() =>
  startTimeOptions.value.map(option => ({ value: option.id, label: option.time }))
)

watch(() => props.course, (newCourse) => {
  if (newCourse) {
    form.value = {
      name: newCourse.name || '',
      titles: newCourse.titles || [''],
      types: newCourse.types || [],
      location_ids: newCourse.location_ids || [],
      start_time_ids: newCourse.start_time_ids || []
    }
  } else {
    form.value = { name: '', titles: [''], types: [], location_ids: [], start_time_ids: [] }
  }
}, { immediate: true })

const submitForm = async () => {
  console.log("save start")
  if (props.course && props.course.id) {
    // Edit existing course
    const { data, error } = await $supabase
      .from('courses')
      .update({ ...form.value })
      .eq('id', props.course.id)
      .select()

    if (!error && data) {
      emit('add-course', data[0])
      emit('course-saved')
      console.log("save event")
    } else {
      console.error(error)
    }
  } else {
    // Add new course
    const { data, error } = await $supabase
      .from('courses')
      .insert([{ ...form.value }])
      .select()

    if (!error && data) {
      emit('add-course', data[0])
      emit('course-saved')
    } else {
      console.error(error)
    }
  }
  emit('close')
}

onMounted(() => {
  fetchTypes()
  fetchLocations()
  fetchStartTimes()
})
</script>
