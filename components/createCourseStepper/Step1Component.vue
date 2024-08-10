<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">Step 1: Standard Organisations Einstellungen</h3>
    <!-- Display organizational settings in read-only mode -->
    <div v-if="settingsLoaded" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="mb-4" v-for="field in fields" :key="field.name">
        <label class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
        <p class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">{{ form[field.name] }}</p>
      </div>
    </div>
    <div v-else>
      <p>Loading settings...</p>
    </div>
    <!-- Next and Cancel buttons -->
    <div class="flex justify-end sticky bottom-0 bg-white py-4">
      <button type="button" @click="$emit('close')" class="mr-2 px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
      <button type="button" @click="nextStep" class="px-4 py-2 bg-green-600 text-white rounded">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'

const { $supabase } = useNuxtApp()

const form = ref({
  supplier_id_ref: '',
  supplier_alt_pid: '',
  contact_type: '',
  contact_role: '',
  salutation: '',
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  url: '',
  contact_remarks: '',
  certificate_status: '',
  certifier_number: '',
  institution: '',
  institution_type: '',
  name: '',
  name2: '',
  mime_source: ''
})

const settingsLoaded = ref(false)

const fields = [
  { name: 'supplier_id_ref', label: 'Supplier ID Ref' },
  { name: 'supplier_alt_pid', label: 'Supplier Alt PID' },
  { name: 'contact_type', label: 'Contact Type' },
  { name: 'contact_role', label: 'Contact Role' },
  { name: 'salutation', label: 'Salutation' },
  { name: 'first_name', label: 'First Name' },
  { name: 'last_name', label: 'Last Name' },
  { name: 'phone', label: 'Phone' },
  { name: 'email', label: 'Email' },
  { name: 'url', label: 'URL' },
  { name: 'contact_remarks', label: 'Contact Remarks' },
  { name: 'certificate_status', label: 'Certificate Status' },
  { name: 'certifier_number', label: 'Certifier Number' },
  { name: 'institution', label: 'Institution' },
  { name: 'institution_type', label: 'Institution Type' },
  { name: 'name', label: 'Name' },
  { name: 'name2', label: 'Name2' },
  { name: 'mime_source', label: 'MIME Source' }
]

const emit = defineEmits(['nextStep'])

const nextStep = () => {
  emit('nextStep')
}

const loadSettings = async () => {
  const { data, error } = await $supabase
    .from('organization_settings')
    .select('*')
    .single()
  
  if (error) {
    console.error(error)
  } else if (data) {
    form.value = data
    settingsLoaded.value = true
  } else {
    settingsLoaded.value = true
  }
}

onMounted(() => {
  loadSettings()
})
</script>
