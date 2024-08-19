<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Edit Organisation Settings</h2>
    <form @submit.prevent="saveSettings">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div class="mb-4" v-for="field in fields" :key="field.name">
          <label :for="field.name" class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
          <input
            v-model="form[field.name]"
            :type="field.type"
            :id="field.name"
            :placeholder="field.placeholder"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div class="flex justify-end">
        <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded">{{ isEditMode ? 'Update' : 'Save' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useNuxtApp } from '#app'

const { $supabase } = useNuxtApp()
const props = defineProps({
  form: Object,
  fields: Array,
  isEditMode: Boolean
})
const emit = defineEmits(['saved'])

const saveSettings = async () => {
  const formCopy = JSON.parse(JSON.stringify(props.form))

  const { data, error } = await $supabase
    .from('organization_settings')
    .upsert(formCopy)
  
  if (error) {
    console.error(error)
  } else {
    emit('saved', formCopy)
  }
}
</script>
