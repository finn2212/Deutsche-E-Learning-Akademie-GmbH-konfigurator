<template>
    <div>
      <h3 class="text-lg font-semibold mb-4">Step 1: Standard Organisations Einstellungen</h3>
      <!-- Add form elements for Step 1 -->
      <form @submit.prevent="nextStep">
        <!-- Add form elements for Step 1 -->
        <div class="flex justify-end sticky bottom-0 bg-white py-4">
          <button type="button" @click="$emit('close')" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Next</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    course: Object
  })
  const emit = defineEmits(['close', 'nextStep'])
  const nextStep = () => {
    emit('nextStep')
  }
  </script>
  