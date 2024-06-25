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
          @click="goToStep(index)"
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
  import { ref, watch } from 'vue'
  
  const props = defineProps({
    steps: {
      type: Array,
      required: true
    },
    modelValue: {
      type: Number,
      required: true
    },
    disableNext: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const currentStep = ref(props.modelValue)
  
  watch(() => props.modelValue, (newValue) => {
    currentStep.value = newValue
  })
  
  const goToStep = (index) => {
    if (index > currentStep.value && props.disableNext) {
      return
    }
    currentStep.value = index
    emit('update:modelValue', currentStep.value)
  }
  </script>
  