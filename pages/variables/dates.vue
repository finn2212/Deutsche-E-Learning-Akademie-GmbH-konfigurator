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
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Loading Dates...</h3>
      <div class="mt-6">
        <div class="spinner"></div>
      </div>
    </div>

    <div v-else-if="dates.length === 0" class="text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Startdatum</th>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Enddatum</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3">
                  <span class="sr-only">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr v-for="date in dates" :key="date.id" class="even:bg-gray-50">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">{{ formatDate(date.start_date) }}</td>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">{{ formatDate(date.end_date) }}</td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                  <button @click="deleteDate(date.id)" class="text-indigo-600 hover:text-indigo-900">Delete<span class="sr-only">, {{ formatDate(date.start_date) }} - {{ formatDate(date.end_date) }}</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Date Modal -->
    <AddDate v-if="showAddDateModal" @close="closeAddDateForm" @dateAdded="handleDateAdded" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { PlusIcon } from "@heroicons/vue/20/solid";
import AddDate from "@/components/dates/AddDate.vue";
import { format, parseISO } from "date-fns";

const { $supabase } = useNuxtApp();
const dates = ref([]);
const loading = ref(true);
const showAddDateModal = ref(false);

const openAddDateForm = () => {
  showAddDateModal.value = true;
};

const closeAddDateForm = () => {
  showAddDateModal.value = false;
};

const handleDateAdded = async (date) => {
  const { data, error } = await $supabase
    .from("dates")
    .insert([date])
    .select();

  if (!error && data) {
    dates.value.push(data[0]);
  } else {
    console.error(error);
  }
  closeAddDateForm();
};

const deleteDate = async (dateId) => {
  await $supabase
    .from("dates")
    .delete()
    .eq("id", dateId);

  dates.value = dates.value.filter((date) => date.id !== dateId);
};

const getDates = async () => {
  const { data, error } = await $supabase.from("dates").select("*");

  if (!error && data) {
    dates.value = data;
  } else {
    console.error(error);
  }
  loading.value = false;
};

const formatDate = (dateStr) => {
  const date = parseISO(dateStr);
  return format(date, "dd.MM.yyyy");
};

onMounted(() => {
  getDates();
});
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
