<template>
  <div class="container mx-auto p-4">
    <Stepper :steps="steps" :modelValue="currentStep" @update:modelValue="updateStep" :disableNext="disableNext">
      <template #default="{ currentStep }">
        <div v-if="currentStep === 0">
          <KurseKonfigurieren
            :courses="courses"
            :selected-courses="selectedCourses"
            @selection-changed="handleSelectionChange"
            @next-step="handleNextStep"
            @course-saved="loadCourses"
          />
        </div>
        <div v-if="currentStep === 1">
          <KurseExportieren
            :courses="courses"
            :selected-courses="selectedCourses"
          />
        </div>
      </template>
    </Stepper>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Stepper from '@/components/Stepper.vue'
import KurseKonfigurieren from '@/components/KurseKonfigurieren.vue'
import KurseExportieren from '@/components/KurseExportieren.vue'
import { useNuxtApp } from '#app'

const steps = ['Kurse Konfigurieren', 'Kurse Exportieren']
const currentStep = ref(0)
const disableNext = ref(true)
const selectedCourses = ref([])
const courses = ref([])

const { $supabase } = useNuxtApp()

const handleSelectionChange = (selected) => {
  selectedCourses.value = selected
  disableNext.value = selectedCourses.value.length === 0
}

const handleNextStep = () => {
  if (!disableNext.value) {
    currentStep.value = 1
  }
}

const updateStep = (newStep) => {
  currentStep.value = newStep
}

watch(currentStep, (newStep) => {
  if (newStep === 0 && selectedCourses.value.length === 0) {
    disableNext.value = true
  }
})

const loadCourses = async () => {
  const { data } = await $supabase
    .from('courses')
    .select('*')
  courses.value = data
}

onMounted(() => {
  loadCourses()
  currentStep.value = 0 // Ensure the first step is selected on load
})
</script>
