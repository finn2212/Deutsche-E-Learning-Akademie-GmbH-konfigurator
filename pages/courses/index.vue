<template>
  <div class="container mx-auto p-4">
    <Stepper :steps="steps" v-model:modelValue="currentStep" :disableNext="disableNext">
      <template #default="{ currentStep }">
        <div v-if="currentStep === 0">
          <KurseKonfigurieren :selected-courses="selectedCourses" @selection-changed="handleSelectionChange" @next-step="handleNextStep" />
        </div>
        <div v-if="currentStep === 1">
          <KurseExportieren />
        </div>
      </template>
    </Stepper>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Stepper from '@/components/Stepper.vue'
import KurseKonfigurieren from '@/components/KurseKonfigurieren.vue'
import KurseExportieren from '@/components/KurseExportieren.vue'

const steps = ['Kurse Konfigurieren', 'Kurse Exportieren']
const currentStep = ref(0)
const disableNext = ref(true)
const selectedCourses = ref([])

const handleSelectionChange = (selected) => {
  selectedCourses.value = selected
  disableNext.value = selectedCourses.value.length === 0
}

const handleNextStep = () => {
  if (!disableNext.value) {
    currentStep.value = 1
  }
}

watch(currentStep, (newStep) => {
  if (newStep === 0 && selectedCourses.value.length === 0) {
    disableNext.value = true
  }
})

onMounted(() => {
  currentStep.value = 0 // Ensure the first step is selected on load
})
</script>
