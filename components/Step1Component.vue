<template>
  <div>
    <h3 class="text-lg font-semibold mb-4">Step 1: Standard Organisations Einstellungen</h3>
    <!-- Display organizational settings in read-only mode -->
    <div v-if="settingsLoaded" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div class="mb-4" v-for="field in fields" :key="field.name">
        <label class="block text-sm font-medium text-gray-700">{{ field.label }}</label>
        <p class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">{{ form[field.name] }}</p>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Emails</label>
        <div v-for="(email, index) in form.emails" :key="index" class="flex items-center">
          <p class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm">{{ email }}</p>
        </div>
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

const fields = [
  { name: 'supplier_id_ref', label: 'Supplier ID Ref' },
  { name: 'contact', label: 'Contact' },
  { name: 'contact_role', label: 'Contact Role' },
  { name: 'salutation', label: 'Salutation' },
  { name: 'first_name', label: 'First Name' },
  { name: 'last_name', label: 'Last Name' },
  { name: 'phone', label: 'Phone' },
  { name: 'mobile', label: 'Mobile' },
  { name: 'fax', label: 'Fax' },
  { name: 'email', label: 'Email' },
  { name: 'url', label: 'URL' },
  { name: 'id_db', label: 'ID DB' },
  { name: 'contact_remarks', label: 'Contact Remarks' },
  { name: 'address_name', label: 'Address Name' },
  { name: 'street', label: 'Street' },
  { name: 'zip', label: 'ZIP' },
  { name: 'city', label: 'City' },
  { name: 'state', label: 'State' },
  { name: 'country', label: 'Country' },
  { name: 'address_remarks', label: 'Address Remarks' },
  { name: 'extended_info', label: 'Extended Info' },
  { name: 'institution', label: 'Institution' },
  { name: 'institution_type', label: 'Institution Type' },
  { name: 'reference_classification_system_name', label: 'Reference Classification System Name' },
  { name: 'fname', label: 'FNAME' },
  { name: 'fvalue', label: 'FVALUE' },
  { name: 'service_price_details', label: 'Service Price Details' },
  { name: 'service_price', label: 'Service Price' },
  { name: 'price_amount', label: 'Price Amount' },
  { name: 'price_currency', label: 'Price Currency' },
  { name: 'remarks', label: 'Remarks' }
]

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
    if (typeof data.emails === 'string') {
      data.emails = data.emails.replace(/{|}/g, '').split(',')
    }
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
