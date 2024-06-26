<template>
    <div class="bg-white p-6 rounded-md shadow-md">
      <h2 class="text-xl font-semibold mb-4">{{ isEditMode ? 'Edit Ort' : 'Ort hinzufügen' }}</h2>
      <div class="space-y-6">
        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="alias" class="block text-sm font-medium leading-6 text-gray-900">Alias</label>
            <input v-model="newOrt.name" type="text" id="alias" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div class="sm:col-span-6">
            <label for="strasse" class="block text-sm font-medium leading-6 text-gray-900">Straße</label>
            <input v-model="newOrt.strasse" type="text" id="strasse" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div class="sm:col-span-2">
            <label for="hausnummer" class="block text-sm font-medium leading-6 text-gray-900">Hausnummer</label>
            <input v-model="newOrt.hausnummer" type="text" id="hausnummer" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div class="sm:col-span-2">
            <label for="plz" class="block text-sm font-medium leading-6 text-gray-900">PLZ</label>
            <input v-model="newOrt.plz" type="text" id="plz" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div class="sm:col-span-2">
            <label for="ort" class="block text-sm font-medium leading-6 text-gray-900">Ort</label>
            <input v-model="newOrt.ort" type="text" id="ort" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div class="sm:col-span-3">
            <label for="bundesland" class="block text-sm font-medium leading-6 text-gray-900">Bundesland</label>
            <input v-model="newOrt.bundesland" type="text" id="bundesland" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div class="sm:col-span-3">
            <label for="land" class="block text-sm font-medium leading-6 text-gray-900">Land</label>
            <input v-model="newOrt.land" type="text" id="land" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
        <div class="flex justify-end">
          <button @click="closeForm" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Abbrechen</button>
          <button @click="saveOrt" class="px-4 py-2 bg-green-600 text-white rounded">{{ isEditMode ? 'Speichern' : 'Hinzufügen' }}</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    newOrt: Object,
    closeForm: Function,
    saveOrt: Function,
    isEditMode: Boolean
  })
  </script>
  