<template>
    <div>
      <nav class="flex mb-4">
        <div
          v-for="(step, index) in steps"
          :key="index"
          :class="[
            'px-4 py-2 border-b-2',
            index === currentStep ? 'border-indigo-600 text-indigo-600' : 'border-gray-300 text-gray-500 cursor-pointer'
          ]"
          @click="currentStep = index"
        >
          {{ step }}
        </div>
      </nav>
      <div class="step-content">
        <slot :currentStep="currentStep"></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
    steps: {
      type: Array,
      required: true
    }
  })
  
  const emit = defineEmits(['update:currentStep'])
  
  const currentStep = ref(0)
  
  watch(currentStep, (newStep) => {
    emit('update:currentStep', newStep)
  })
  </script>
  