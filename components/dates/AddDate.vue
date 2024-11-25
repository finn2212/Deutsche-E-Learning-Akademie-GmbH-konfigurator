<template>
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div class="bg-white p-6 rounded-md shadow-md">
        <h2 class="text-xl font-semibold mb-4">Daten Hinzugefügen</h2>
        <form @submit.prevent="submitDate">
          <div class="mb-4">
            <label for="start-date" class="block text-sm font-medium text-gray-700">Startdatum</label>
            <input
              v-model="newStartDate"
              id="start-date"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
  
          <!-- Main End Date Section -->
          <div class="mb-4">
            <label for="end-date-mode" class="block text-sm font-medium text-gray-700">Enddatum-Modus</label>
            <select
              v-model="endDateMode"
              id="end-date-mode"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="manual">Manuelles Enddatum</option>
              <option value="smart">Intelligentes Enddatum</option>
            </select>
          </div>
  
          <div v-if="endDateMode === 'smart'" class="mb-4">
            <label for="smart-end-date" class="block text-sm font-medium text-gray-700">Enddatum-Dauer</label>
            <select
              v-model="smartEndDateOption"
              id="smart-end-date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="1_week">1 Woche</option>
              <option value="2_weeks">2 Wochen</option>
              <option value="3_weeks">3 Wochen</option>
              <option value="4_weeks">4 Wochen</option>
              <option value="1_month">1 Monat</option>
              <option value="2_months">2 Monate</option>
              <option value="3_months">3 Monate</option>
            </select>
          </div>
  
          <div class="mb-4">
            <label for="end-date" class="block text-sm font-medium text-gray-700">Enddatum</label>
            <input
              v-model="newEndDate"
              id="end-date"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
  
  
          <div v-if="endDateMode === 'smart'" class="mb-4">
            <label for="part-time-percentage" class="block text-sm font-medium text-gray-700">Teilzeit Dauer (Prozent länger)</label>
            <select
              v-model="partTimePercentage"
              id="part-time-percentage"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="20">20%</option>
              <option value="30">30%</option>
              <option value="40">40%</option>
            </select>
          </div>
  
          <div class="mb-4">
            <label for="part-time-end-date" class="block text-sm font-medium text-gray-700">Teilzeit-Enddatum</label>
            <input
              v-model="partTimeEndDate"
              id="part-time-end-date"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
  
          <div class="flex justify-end">
            <button @click="closeModal" type="button" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">
              Abbrechen
            </button>
            <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  import { format, parseISO, addDays } from "date-fns";
  
  const props = defineProps(["show"]);
  const emit = defineEmits(["close", "dateAdded"]);
  
  const newStartDate = ref("");
  const newEndDate = ref("");
  const endDateMode = ref("manual");
  const smartEndDateOption = ref("");
  const partTimePercentage = ref("20");
  const partTimeEndDate = ref("");
  
  const calculateSmartEndDate = (startDate, option) => {
    const date = new Date(startDate);
    if (!date) return null;
  
    switch (option) {
      case "1_week":
        date.setDate(date.getDate() + 7);
        break;
      case "2_weeks":
        date.setDate(date.getDate() + 14);
        break;
      case "3_weeks":
        date.setDate(date.getDate() + 21);
        break;
      case "4_weeks":
        date.setDate(date.getDate() + 28);
        break;
      case "1_month":
        date.setMonth(date.getMonth() + 1);
        break;
      case "2_months":
        date.setMonth(date.getMonth() + 2);
        break;
      case "3_months":
        date.setMonth(date.getMonth() + 3);
        break;
      default:
        return null;
    }
  
    return format(date, "yyyy-MM-dd");
  };
  
  const calculatePartTimeEndDate = (endDate, percentage) => {
    if (!endDate) return null;
    const additionalDays = Math.ceil((parseInt(percentage) / 100) * 30); // Estimate additional duration
    const newDate = addDays(parseISO(endDate), additionalDays);
    return format(newDate, "yyyy-MM-dd");
  };
  
  const closeModal = () => {
    emit("close");
  };
  
  const submitDate = () => {
    emit("dateAdded", {
      start_date: newStartDate.value,
      end_date: newEndDate.value,
      part_time_end_date: partTimeEndDate.value,
    });
  };
  
  watch([newStartDate, smartEndDateOption], () => {
    if (endDateMode.value === "smart" && newStartDate.value && smartEndDateOption.value) {
      newEndDate.value = calculateSmartEndDate(newStartDate.value, smartEndDateOption.value);
    }
  });
  
  watch([newEndDate, partTimePercentage], () => {
    if (endDateMode.value === "smart") {
      partTimeEndDate.value = calculatePartTimeEndDate(newEndDate.value, partTimePercentage.value);
    }
  });
  </script>
  