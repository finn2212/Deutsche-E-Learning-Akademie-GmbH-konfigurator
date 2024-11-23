<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">Start- und Enddaten Verwalten</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all the start and end dates in your account.</p>
      </div>
      <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button @click="openAddDateForm" type="button"
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Datum hinzufügen
        </button>
      </div>
    </div>
    <div v-if="loading" class="text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Loading Dates...</h3>
      <div class="mt-6">
        <div class="spinner"></div>
      </div>
    </div>
    <div v-else-if="dates.length === 0" class="text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No Dates</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new date range.</p>
      <div class="mt-6">
        <button @click="openAddDateForm" type="button"
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Datum hinzufügen
        </button>
      </div>
    </div>
    <div v-else class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
                  Startdatum</th>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Enddatum
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3">
                  <span class="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="date in dates" :key="date.id" class="even:bg-gray-50">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">{{
                  formatDate(date.start_date) }}</td>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">{{
                  formatDate(date.end_date) }}</td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                  <button @click="deleteDate(date.id)" class="text-indigo-600 hover:text-indigo-900">Delete<span
                      class="sr-only">, {{ formatDate(date.start_date) }} - {{ formatDate(date.end_date)
                      }}</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Date Form Modal -->
    <!-- Add Date Form Modal -->
    <div v-if="showAddDateForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded-md shadow-md">
        <h2 class="text-xl font-semibold mb-4">Add Date Range</h2>
        <div class="mb-4">
          <label for="start-date" class="block text-sm font-medium text-gray-700">Startdatum</label>
          <input v-model="newStartDate" id="start-date" type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div class="mb-4">
          <label for="end-date-mode" class="block text-sm font-medium text-gray-700">Enddatum-Modus</label>
          <select v-model="endDateMode" id="end-date-mode"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="manual">Manuelles Enddatum</option>
            <option value="smart">Intelligentes Enddatum</option>
          </select>
        </div>
        <div v-if="endDateMode === 'manual'" class="mb-4">
          <label for="end-date" class="block text-sm font-medium text-gray-700">Enddatum</label>
          <input v-model="newEndDate" id="end-date" type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div v-if="endDateMode === 'smart'" class="mb-4">
          <label for="smart-end-date" class="block text-sm font-medium text-gray-700">Enddatum-Dauer</label>
          <select v-model="smartEndDateOption" id="smart-end-date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="1_week">1 Woche</option>
            <option value="2_weeks">2 Wochen</option>
            <option value="3_weeks">3 Wochen</option>
            <option value="4_weeks">4 Wochen</option>
            <option value="1_month">1 Monat</option>
            <option value="2_months">2 Monate</option>
            <option value="3_months">3 Monate</option>
            <option value="4_months">4 Monate</option>
            <option value="5_months">5 Monate</option>
            <option value="6_months">6 Monate</option>
          </select>
        </div>
        <div class="flex justify-end">
          <button @click="closeAddDateForm" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Abbrechen</button>
          <button @click="addDate" class="px-4 py-2 bg-green-600 text-white rounded">Speichern</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import { PlusIcon } from '@heroicons/vue/20/solid'
import { format, parseISO } from 'date-fns'

const { $supabase } = useNuxtApp()
const dates = ref([])
const newStartDate = ref('')
const newEndDate = ref('')
const loading = ref(true)
const showAddDateForm = ref(false)
const endDateMode = ref('manual'); // Default mode
const smartEndDateOption = ref('');

const openAddDateForm = () => {
  showAddDateForm.value = true
}

const closeAddDateForm = () => {
  showAddDateForm.value = false
  newStartDate.value = ''
  newEndDate.value = ''
}

const addDate = async () => {
  if (!newStartDate.value) {
    console.warn('Startdatum ist erforderlich.');
    return;
  }

  let endDate;
  if (endDateMode.value === 'manual') {
    if (!newEndDate.value) {
      console.warn('Enddatum ist erforderlich im manuellen Modus.');
      return;
    }
    endDate = format(parseISO(newEndDate.value), 'yyyy-MM-dd');
  } else if (endDateMode.value === 'smart') {
    endDate = calculateSmartEndDate(newStartDate.value, smartEndDateOption.value);
    if (!endDate) {
      console.warn('Ungültige Option für intelligentes Enddatum.');
      return;
    }
  }

  loading.value = true;
  const formattedStartDate = format(parseISO(newStartDate.value), 'yyyy-MM-dd');

  const { data, error } = await $supabase
    .from('dates')
    .insert([{ start_date: formattedStartDate, end_date: endDate }])
    .select();

  loading.value = false;
  if (!error && data) {
    dates.value.push(data[0]);
    closeAddDateForm();
  } else {
    console.error(error);
  }
};

const calculateSmartEndDate = (startDate, option) => {
  const date = new Date(startDate);
  if (!date) return null;

  switch (option) {
    case '1_week':
      date.setDate(date.getDate() + 7);
      break;
    case '2_weeks':
      date.setDate(date.getDate() + 14);
      break;
    case '3_weeks':
      date.setDate(date.getDate() + 21);
      break;
    case '4_weeks':
      date.setDate(date.getDate() + 28);
      break;
    case '1_month':
      date.setMonth(date.getMonth() + 1);
      break;
    case '2_months':
      date.setMonth(date.getMonth() + 2);
      break;
    case '3_months':
      date.setMonth(date.getMonth() + 3);
      break;
    case '4_months':
      date.setMonth(date.getMonth() + 4);
      break;
    case '5_months':
      date.setMonth(date.getMonth() + 5);
      break;
    case '6_months':
      date.setMonth(date.getMonth() + 6);
      break;
    default:
      return null;
  }

  return format(date, 'yyyy-MM-dd'); // Format as 'YYYY-MM-DD'
};

const deleteDate = async (dateId) => {
  await $supabase
    .from('dates')
    .delete()
    .eq('id', dateId)

  dates.value = dates.value.filter(date => date.id !== dateId)
}

const getDates = async () => {
  const { data, error } = await $supabase
    .from('dates')
    .select('*')

  if (!error && data) {
    dates.value = data
  } else {
    console.error(error)
  }
  loading.value = false
}

const formatDate = (dateStr) => {
  const date = parseISO(dateStr)
  return format(date, 'dd.MM.yyyy')
}

onMounted(() => {
  getDates()
})
</script>

<style>
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