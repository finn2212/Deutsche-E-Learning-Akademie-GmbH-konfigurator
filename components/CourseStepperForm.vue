<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white p-6 rounded-md shadow-md max-h-screen overflow-y-auto w-full max-w-4xl">
      <h2 class="text-xl font-semibold mb-4">{{ course && course.id ? 'Kurs bearbeiten' : 'Kurs hinzufügen' }}</h2>
      <div class="overflow-y-auto max-h-[70vh]">
        <Stepper :steps="steps" :modelValue="currentStep" @update:modelValue="updateStep">
          <template #default="{ currentStep }">
            <Step1Component v-if="currentStep === 0" :course="course" @nextStep="nextStep" @close="closeForm" />
            <Step2Component v-if="currentStep === 1" :course="course" @prevStep="prevStep" @nextStep="nextStepWithCourseType" @close="closeForm" />
            <Step3Component v-if="currentStep === 2" :course="course" :selectedCourseType="selectedCourseType" @prevStep="prevStep" @close="closeForm" @add-course="addCourse" @course-saved="courseSaved" />
          </template>
        </Stepper>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Stepper from '@/components/Stepper.vue'
import Step1Component from '@/components/Step1Component.vue'
import Step2Component from '@/components/Step2Component.vue'
import Step3Component from '@/components/Step3Component.vue'

const props = defineProps({
  course: Object
})

const emit = defineEmits(['close', 'add-course', 'course-saved'])

const steps = ['Standard Organisations Einstellungen', 'Kurs Spezifische Fix Daten', 'Variable Kurs Daten']
const currentStep = ref(0)
const selectedCourseType = ref(null) // Track the selected course type

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const nextStepWithCourseType = (courseTypeId) => {
  selectedCourseType.value = courseTypeId // Save the selected course type
  nextStep()
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const updateStep = (newStep) => {
  // Prevent step labels from being clickable
  // Do not update the currentStep value
}

const closeForm = () => {
  emit('close')
}

const addCourse = (course) => {
  emit('add-course', course)
}

const courseSaved = () => {
  emit('course-saved')
}
</script>
