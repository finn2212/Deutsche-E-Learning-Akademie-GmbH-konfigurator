<template>
  <div>
    <ul class="stepper">
      <li v-for="(step, index) in steps" :key="index" :class="{ active: index <= modelValue }">
        <span>{{ step }}</span>
      </li>
    </ul>
    <slot :currentStep="modelValue"></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  steps: Array,
  modelValue: Number,
  disableNext: Boolean
})

const emit = defineEmits(['update:modelValue'])

const updateStep = (index) => {
  // No action needed to prevent click
}
</script>

<style scoped>
.stepper {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.stepper li {
  flex: 1;
  text-align: center;
  padding: 10px;
  cursor: default; /* Change cursor to default */
  color: gray;
}

.stepper li.active {
  color: black;
  font-weight: bold;
}
</style>
