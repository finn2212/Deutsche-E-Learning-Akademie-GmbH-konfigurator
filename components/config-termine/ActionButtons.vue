<template>
  <div class="flex items-center space-x-2 mt-2">
    <div class="relative">
      <button @click="toggleDropdown"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Aktionen</button>
      <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
        <div class="px-4 py-2 font-semibold text-gray-700 border-b border-gray-200">XML-Funktionen</div>

        <button @click="triggerAction('new')" class="block w-full px-4 py-2 text-left">New</button>
        <button @click="triggerAction('update')" class="block w-full px-4 py-2 text-left">Update</button>
        <button @click="triggerAction('delete')" class="block w-full px-4 py-2 text-left">Delete</button>
        <!-- Label after the buttons -->
        <div class="px-4 py-2 font-semibold text-gray-700 border-t border-gray-200">Andere-Funktionen</div>
        <button @click="triggerAction('deleteAll')" class="block w-full px-4 py-2 text-left">Alle Ausgewählten löschen</button>
        <button @click="triggerAction('copy')" class="block w-full px-4 py-2 text-left">Alle Ausgewählten Kopieren</button>
      </div>
    </div>
    <button @click="addSingleAppointment"
      class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Termine anlegen</button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const dropdownOpen = ref(false);
const emit = defineEmits(['action', 'addSingleAppointment']);

// Toggle dropdown visibility
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Emit action type and selected course IDs to the parent
const triggerAction = (type) => {
  emit('action', { type });
  dropdownOpen.value = false;
};

const addSingleAppointment = () => {
  emit('addSingleAppointment');
};
</script>