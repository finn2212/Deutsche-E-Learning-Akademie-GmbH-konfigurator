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
      <div class="mb-4">
        <label for="emails" class="block text-sm font-medium text-gray-700">Emails</label>
        <div v-for="(email, index) in form.emails" :key="index" class="flex items-center">
          <input
            v-model="form.emails[index]"
            type="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter Email"
          />
          <button type="button" @click="removeEmail(index)" class="ml-2 font-semibold text-red-600 hover:text-red-500">Remove</button>
        </div>
        <button type="button" @click="addEmail" class="mt-2 font-semibold text-green-600 hover:text-green-500">Add Email</button>
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

const addEmail = () => {
  props.form.emails.push('')
}

const removeEmail = (index) => {
  props.form.emails.splice(index, 1)
}

const saveSettings = async () => {
  const formCopy = JSON.parse(JSON.stringify(props.form))
  formCopy.emails = `{${formCopy.emails.join(',')}}` // Convert emails array to PostgreSQL array format

  if (!formCopy.id_db) formCopy.id_db = null;

  const { data, error } = await $supabase
    .from('organization_settings')
    .upsert(formCopy)
  
  if (error) {
    console.error(error)
  } else {
    formCopy.emails = formCopy.emails.replace(/{|}/g, '').split(',') // Revert emails to array for frontend
    emit('saved', formCopy)
  }
}
</script>
