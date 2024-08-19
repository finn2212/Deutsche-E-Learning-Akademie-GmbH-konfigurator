<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">Manage Orte</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all the Orte in your account including their name.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button @click="openAddOrtForm" type="button" class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Ort hinzufügen</button>
      </div>
    </div>
    <div v-if="loading" class="text-center">
      <!-- Loading state -->
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Loading Orte...</h3>
      <div class="mt-6">
        <div class="spinner"></div>
      </div>
    </div>
    <div v-else-if="orte.length === 0" class="text-center">
      <!-- No Orte state -->
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No Orte</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new Ort.</p>
      <div class="mt-6">
        <button @click="openAddOrtForm" type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New Ort
        </button>
      </div>
    </div>
    <div v-else class="mt-8 flow-root">
      <!-- Grid of Orte -->
      <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <li v-for="ort in orte" :key="ort.id" class="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow relative">
          <div class="flex flex-1 flex-col p-8 text-left">
            <h3 class="text-sm font-medium text-gray-900">Alias: {{ ort.name }}</h3>
            <p class="text-sm text-gray-500 mt-2">Straße: {{ ort.strasse }}</p>
            <p class="text-sm text-gray-500 mt-2">Hausnummer: {{ ort.hausnummer }}</p>
            <p class="text-sm text-gray-500 mt-2">PLZ: {{ ort.plz }}</p>
            <p class="text-sm text-gray-500 mt-2">Ort: {{ ort.ort }}</p>
            <p class="text-sm text-gray-500 mt-2">Bundesland: {{ ort.bundesland }}</p>
            <p class="text-sm text-gray-500 mt-2">Land: {{ ort.land }}</p>
          </div>
          <div>
            <div class="-mt-px flex divide-x divide-gray-200">
              <div class="flex w-0 flex-1">
                <button @click="editOrt(ort)" class="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                  <span>Edit</span>
                </button>
              </div>
              <div class="-ml-px flex w-0 flex-1">
                <button @click="deleteOrt(ort.id)" class="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900">
                  <span>Entfernen</span>
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Ort hinzufügen Form Modal -->
    <div v-if="showAddOrtForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <AddOrtForm :newOrt="newOrt" :closeForm="closeAddOrtForm" :saveOrt="saveOrt" :isEditMode="isEditMode" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import AddOrtForm from '~/components/forms/AddOrtForm.vue'

const { $supabase } = useNuxtApp()
const orte = ref([])
const newOrt = ref({ name: '', strasse: '', hausnummer: '', plz: '', ort: '', bundesland: '', land: '' })
const loading = ref(true)
const showAddOrtForm = ref(false)
const isEditMode = ref(false)

const openAddOrtForm = () => {
  showAddOrtForm.value = true
  isEditMode.value = false
}

const closeAddOrtForm = () => {
  showAddOrtForm.value = false
  newOrt.value = { name: '', strasse: '', hausnummer: '', plz: '', ort: '', bundesland: '', land: '' }
  isEditMode.value = false
}

const addOrt = async () => {
  const { data, error } = await $supabase
    .from('places')
    .insert([{ ...newOrt.value }])
    .select()

  if (!error && data) {
    getOrte() // Reload Orte after adding
  } else {
    console.error(error)
  }
}

const updateOrt = async () => {
  const { data, error } = await $supabase
    .from('places')
    .update(newOrt.value)
    .eq('id', newOrt.value.id)
    .select()

  if (!error && data) {
    getOrte() // Reload Orte after updating
  } else {
    console.error(error)
  }
}

const saveOrt = () => {
  if (isEditMode.value) {
    updateOrt()
  } else {
    addOrt()
  }
  closeAddOrtForm()
}

const editOrt = (ort) => {
  newOrt.value = { ...ort }
  showAddOrtForm.value = true
  isEditMode.value = true
}

const deleteOrt = async (ortId) => {
  await $supabase
    .from('places')
    .delete()
    .eq('id', ortId)

  getOrte() // Reload Orte after deleting
}

const getOrte = async () => {
  const { data, error } = await $supabase
    .from('places')
    .select('*')

  if (!error && data) {
    orte.value = data
  } else {
    console.error(error)
  }
  loading.value = false
}

onMounted(() => {
  getOrte()
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
