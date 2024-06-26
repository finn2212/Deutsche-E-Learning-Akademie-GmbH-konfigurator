<template>
    <div class="container mx-auto p-4">
      <Stepper :steps="steps" :modelValue="currentStep" @update:modelValue="updateStep" :disableNext="disableNext">
        <template #default="{ currentStep }">
          <div v-if="currentStep === 0">
            <h2 class="text-xl font-semibold mb-4">Schritt 1: Standart Organisations einstellungen</h2>
            <!-- Add content for Step 1 here -->
          </div>
          <div v-if="currentStep === 1">
            <h2 class="text-xl font-semibold mb-4">Schritt 2: Kurs spezefische Fix Daten</h2>
            <!-- Add content for Step 2 here -->
          </div>
          <div v-if="currentStep === 2">
            <h2 class="text-xl font-semibold mb-4">Schritt 3: Variable Kurs Daten</h2>
            <CourseForm
              :course="selectedCourse"
              @close="closeCourseForm"
              @add-course="addCourse"
              @course-saved="loadCourses"
            />
          </div>
        </template>
      </Stepper>
      <div class="flex justify-end mt-4">
        <button @click="prevStep" :disabled="currentStep === 0" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Back</button>
        <button @click="nextStep" :disabled="disableNext" class="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import Stepper from '@/components/Stepper.vue'
  import CourseForm from '@/components/CourseForm.vue'
  import { useNuxtApp } from '#app'
  
  const steps = ['Standart Organisations einstellungen', 'Kurs spezefische Fix Daten', 'Variable Kurs Daten']
  const currentStep = ref(0)
  const disableNext = ref(false)
  const selectedCourse = ref(null)
  const courses = ref([])
  
  const { $supabase } = useNuxtApp()
  
  const nextStep = () => {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++
    }
  }
  
  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }
  
  const updateStep = (newStep) => {
    currentStep.value = newStep
  }
  
  watch(currentStep, (newStep) => {
    if (newStep === 0) {
      disableNext.value = false
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
  
  const addCourse = (course) => {
    // Add course logic
  }
  
  const closeCourseForm = () => {
    // Close form logic
  }
  </script>
  