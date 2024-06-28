<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">View Organisation Settings</h2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="mb-4" v-for="field in fields" :key="field.name">
        <label class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
        <p class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">{{ form[field.name] }}</p>
      </div>
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Emails</label>
      <div v-for="(email, index) in form.emails" :key="index" class="flex items-center">
        <p class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">{{ email }}</p>
      </div>
    </div>
    <div class="flex justify-end">
      <button @click="$emit('edit')" class="px-4 py-2 bg-indigo-600 text-white rounded">Edit</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  form: Object,
  fields: Array
})
</script>
