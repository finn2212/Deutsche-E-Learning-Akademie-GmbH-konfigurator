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
import SettingsView from '../../components/SettingsView.vue'
import SettingsEdit from '../../components/SettingsEdit.vue'
import { useNuxtApp } from '#app'

const { $supabase } = useNuxtApp()
const form = ref({
  supplier_id_ref: '',
  contact: '',
  contact_role: '',
  salutation: '',
  first_name: '',
  last_name: '',
  phone: '',
  mobile: '',
  fax: '',
  emails: [''],
  email: '',
  url: '',
  id_db: '',
  contact_remarks: '',
  address_name: '',
  street: '',
  zip: '',
  city: '',
  state: '',
  country: '',
  address_remarks: '',
  extended_info: '',
  institution: '',
  institution_type: '',
  reference_classification_system_name: '',
  fname: '',
  fvalue: '',
  service_price_details: '',
  service_price: '',
  price_amount: '',
  price_currency: '',
  remarks: ''
})

const settingsLoaded = ref(false)
const isEditMode = ref(false)

const fields = [
  { name: 'supplier_id_ref', label: 'Supplier ID Ref', type: 'text', placeholder: 'Enter Supplier ID Ref' },
  { name: 'contact', label: 'Contact', type: 'text', placeholder: 'Enter Contact' },
  { name: 'contact_role', label: 'Contact Role', type: 'text', placeholder: 'Enter Contact Role' },
  { name: 'salutation', label: 'Salutation', type: 'text', placeholder: 'Enter Salutation' },
  { name: 'first_name', label: 'First Name', type: 'text', placeholder: 'Enter First Name' },
  { name: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Enter Last Name' },
  { name: 'phone', label: 'Phone', type: 'text', placeholder: 'Enter Phone' },
  { name: 'mobile', label: 'Mobile', type: 'text', placeholder: 'Enter Mobile' },
  { name: 'fax', label: 'Fax', type: 'text', placeholder: 'Enter Fax' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
  { name: 'url', label: 'URL', type: 'text', placeholder: 'Enter URL' },
  { name: 'id_db', label: 'ID DB', type: 'text', placeholder: 'Enter ID DB' },
  { name: 'contact_remarks', label: 'Contact Remarks', type: 'text', placeholder: 'Enter Contact Remarks' },
  { name: 'address_name', label: 'Address Name', type: 'text', placeholder: 'Enter Address Name' },
  { name: 'street', label: 'Street', type: 'text', placeholder: 'Enter Street' },
  { name: 'zip', label: 'ZIP', type: 'text', placeholder: 'Enter ZIP' },
  { name: 'city', label: 'City', type: 'text', placeholder: 'Enter City' },
  { name: 'state', label: 'State', type: 'text', placeholder: 'Enter State' },
  { name: 'country', label: 'Country', type: 'text', placeholder: 'Enter Country' },
  { name: 'address_remarks', label: 'Address Remarks', type: 'text', placeholder: 'Enter Address Remarks' },
  { name: 'extended_info', label: 'Extended Info', type: 'text', placeholder: 'Enter Extended Info' },
  { name: 'institution', label: 'Institution', type: 'text', placeholder: 'Enter Institution' },
  { name: 'institution_type', label: 'Institution Type', type: 'text', placeholder: 'Enter Institution Type' },
  { name: 'reference_classification_system_name', label: 'Reference Classification System Name', type: 'text', placeholder: 'Enter Reference Classification System Name' },
  { name: 'fname', label: 'FNAME', type: 'text', placeholder: 'Enter FNAME' },
  { name: 'fvalue', label: 'FVALUE', type: 'text', placeholder: 'Enter FVALUE' },
  { name: 'service_price_details', label: 'Service Price Details', type: 'text', placeholder: 'Enter Service Price Details' },
  { name: 'service_price', label: 'Service Price', type: 'text', placeholder: 'Enter Service Price' },
  { name: 'price_amount', label: 'Price Amount', type: 'number', placeholder: 'Enter Price Amount' },
  { name: 'price_currency', label: 'Price Currency', type: 'text', placeholder: 'Enter Price Currency' },
  { name: 'remarks', label: 'Remarks', type: 'text', placeholder: 'Enter Remarks' }
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
    if (typeof data.emails === 'string') {
      data.emails = data.emails.replace(/{|}/g, '').split(',')
    }
    form.value = data
    settingsLoaded.value = true
  } else {
    settingsLoaded.value = true
  }
}

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value
}

const handleSave = (updatedForm) => {
  form.value = updatedForm
  isEditMode.value = false
}

onMounted(() => {
  loadSettings()
})
</script>
