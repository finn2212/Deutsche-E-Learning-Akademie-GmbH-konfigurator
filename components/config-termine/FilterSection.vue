<template>
    <div class="flex items-center space-x-4">
      <div v-for="(filter, key) in filters" :key="key" class="flex items-center space-x-2">
        <label :for="`${key}Filter`" class="text-sm font-medium">{{ filter.label }}:</label>
        <component :is="filter.type === 'date' ? 'input' : 'select'" 
                   :id="`${key}Filter`" 
                   v-model="filters[key].value" 
                   :class="filter.class"
                   :type="filter.type || undefined">
          <option v-if="filter.options" v-for="option in filter.options" :key="option.value" :value="option.value">{{ option.label }}</option>
        </component>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const filters = ref({
    kurs: { label: 'Kurs', value: '', class: 'block w-48', options: [{ value: '', label: 'All' }] },
    standort: { label: 'Standort', value: '', class: 'block w-48', options: [{ value: '', label: 'All' }] },
    vzTz: { label: 'Vz/Tz', value: '', class: 'block w-48', options: [{ value: '', label: 'All' }, { value: 'Vz', label: 'Vollzeit' }, { value: 'Tz', label: 'Teilzeit' }] },
    startd: { label: 'Startd.', value: '', class: 'block w-48', type: 'date' },
    status: { label: 'Status', value: '', class: 'block w-48', options: [{ value: '', label: 'All' }, { value: 'Aktiv', label: 'Aktiv' }, { value: 'Inaktiv', label: 'Inaktiv' }] }
  });
  </script>
  