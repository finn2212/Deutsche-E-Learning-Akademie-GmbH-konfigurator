<template>
    <div>
      <h3 class="text-lg font-semibold mb-4">Step 2: Kurs Spezifische Fix Daten</h3>
      <!-- Add form elements for Step 2 -->
      <form @submit.prevent="nextStep">
        <!-- Add form elements for Step 2 -->
        <div class="flex justify-end sticky bottom-0 bg-white py-4">
          <button type="button" @click="prevStep" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Back</button>
          <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Next</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    course: Object
  })
  const emit = defineEmits(['prevStep', 'nextStep'])
  const nextStep = () => {
    emit('nextStep')
  }
  const prevStep = () => {
    emit('prevStep')
  }
  </script>
  