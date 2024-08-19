<template>
    <div class="relative min-w-[300px]">
      <button @click="toggleDropdown" type="button" class="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <span class="block truncate">{{ selectedLabel }}</span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 9.586l3.293-3.293a1 1 011.414 1.414l-4 4A1 1 0 0110 12z" clip-rule="evenodd" />
          </svg>
        </span>
      </button>
      <div v-if="isOpen" class="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
        <ul class="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" @click.stop>
          <li v-for="option in options" :key="option.value" @click="selectOption(option)" class="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-indigo-600 hover:text-white">
            <span :class="{ 'font-semibold': isSelected(option) }" class="block truncate">{{ option.label }}</span>
            <span v-if="isSelected(option)" class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 hover:text-white">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 6.293a1 1 0 00-1.414 0L10 11.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l6-6a1 1 0 000-1.414z" clip-rule="evenodd" />
              </svg>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  
  const props = defineProps({
    modelValue: [String, Number],
    options: {
      type: Array,
      required: true
    }
  })
  
  const emit = defineEmits(['update:modelValue'])
  
  const isOpen = ref(false)
  const selectedLabel = computed(() => {
    const selectedOption = props.options.find(option => option.value === props.modelValue)
    return selectedOption ? selectedOption.label : 'Select...'
  })
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }
  
  const selectOption = (option) => {
    emit('update:modelValue', option.value)
    isOpen.value = false
  }
  
  const isSelected = (option) => {
    return option.value === props.modelValue
  }
  
  watch(() => props.modelValue, (newValue) => {
    if (!props.options.find(option => option.value === newValue)) {
      emit('update:modelValue', null)
    }
  })
  </script>
  