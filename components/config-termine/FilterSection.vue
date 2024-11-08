<template>
  <div class="flex items-center space-x-4">
    <div v-for="(filter, key) in filters" :key="key" class="flex items-center space-x-2">
      <label :for="`${key}Filter`" class="text-sm font-medium">{{ filter.label }}:</label>
      <component 
        :is="filter.type === 'date' ? 'input' : 'select'" 
        :id="`${key}Filter`" 
        v-model="filter.value" 
        :class="filter.class" 
        :type="filter.type || undefined"
        @change="emitFilterChange(key, $event.target.value)"
      >
        <option 
          v-if="filter.options" 
          v-for="option in filter.options" 
          :key="option.value" 
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </component>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  filters: Object
});

const emit = defineEmits(['updateFilter']);

// Emit filter change directly when the value changes
const emitFilterChange = (key, value) => {
  console.log("Emitting filter change for key:", key, "with value:", value); // Debug log
  emit('updateFilter', { key, value });
};
</script>
