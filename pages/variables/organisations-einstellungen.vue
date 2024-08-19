<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Organisations Einstellungen</h1>
    <p v-if="!settingsLoaded && !form.id">Loading settings...</p>
    <p v-if="settingsLoaded && !form.id" class="text-red-500">Please create entries for organization settings.</p>
    <SettingsView v-if="!isEditMode" :form="form" :fields="fields" @edit="toggleEditMode" />
    <SettingsEdit v-else :form="form" :fields="fields" @saved="handleSave" :isEditMode="isEditMode" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SettingsView from '../../components/forms/SettingsView.vue'
import SettingsEdit from '../../components/forms/SettingsEdit.vue'
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
const isEditMode = ref(false)

const fields = [
  { name: 'supplier_id_ref', label: 'Supplier ID Ref', type: 'text', placeholder: 'Enter Supplier ID Ref' },
  { name: 'supplier_alt_pid', label: 'Supplier Alt PID', type: 'text', placeholder: 'Enter Supplier Alt PID' },
  { name: 'contact_type', label: 'Contact Type', type: 'text', placeholder: 'Enter Contact Type' },
  { name: 'contact_role', label: 'Contact Role', type: 'text', placeholder: 'Enter Contact Role' },
  { name: 'salutation', label: 'Salutation', type: 'text', placeholder: 'Enter Salutation' },
  { name: 'first_name', label: 'First Name', type: 'text', placeholder: 'Enter First Name' },
  { name: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Enter Last Name' },
  { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter Phone' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
  { name: 'url', label: 'URL', type: 'text', placeholder: 'Enter URL' },
  { name: 'contact_remarks', label: 'Contact Remarks', type: 'text', placeholder: 'Enter Contact Remarks' },
  { name: 'certificate_status', label: 'Certificate Status', type: 'text', placeholder: 'Enter Certificate Status' },
  { name: 'certifier_number', label: 'Certifier Number', type: 'text', placeholder: 'Enter Certifier Number' },
  { name: 'institution', label: 'Institution', type: 'text', placeholder: 'Enter Institution' },
  { name: 'institution_type', label: 'Institution Type', type: 'text', placeholder: 'Enter Institution Type' },
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter Name' },
  { name: 'name2', label: 'Name2', type: 'text', placeholder: 'Enter Name2' },
  { name: 'mime_source', label: 'MIME Source', type: 'text', placeholder: 'Enter MIME Source' }
]

const loadSettings = async () => {
  const { data, error } = await $supabase
    .from('organization_settings')
    .select('*')
    .single()
  
  if (error) {
    console.error(error)
    settingsLoaded.value = true
  } else if (data) {
    form.value = data
    settingsLoaded.value = true
  } else {
    settingsLoaded.value = true
    isEditMode.value = true  // Switch to edit mode if no data is returned
  }
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const handleSave = async (updatedForm) => {
  const { error } = await $supabase
    .from('organization_settings')
    .upsert(updatedForm)
  
  if (error) {
    console.error(error)
  } else {
    form.value = updatedForm
    isEditMode.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>
