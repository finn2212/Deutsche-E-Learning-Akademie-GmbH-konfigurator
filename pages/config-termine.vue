<script setup>
import { ref, computed, onMounted } from 'vue';
import FilterSection from '../components/config-termine/FilterSection.vue';
import ActionButtons from '../components/config-termine/ActionButtons.vue';
import KursTable from '../components/config-termine/KursTable.vue';
import { useNuxtApp } from '#app';
import XmlHelper2 from '../helper/xmlHelper2.0';

const { $supabase } = useNuxtApp();
const kursData = ref([]);
const selectedCourses = ref([]);
const filters = ref({ kurs: "", standort: "", vzTz: "", startd: "", status: "" });
const selectAll = ref(false);

const fetchKursData = async () => {
  const { data, error } = await $supabase.from('all_termine').select('*');
  if (error) {
    console.error('Error fetching data:', error);
  } else {
    kursData.value = data.map(item => ({ ...item, selected: false }));
  }
};

onMounted(() => {
  fetchKursData();
});

const filteredKursData = computed(() => {
  return kursData.value.filter(item => {
    return (
      (filters.value.kurs === "" || item.kurs === filters.value.kurs) &&
      (filters.value.standort === "" || item.standort === filters.value.standort) &&
      (filters.value.vzTz === "" || item.type === filters.value.vzTz) &&
      (filters.value.startd === "" || item.startd === filters.value.startd) &&
      (filters.value.status === "" || item.status === filters.value.status)
    );
  });
});

// Trigger xmlHelper2.0 based on action
const handleActionEvent = async ({ type }) => {
  if (selectedCourses.value.length === 0) {
    console.warn('No courses selected for action');
    return;
  }

  const organizationSettings = await fetchOrganizationSettings()
  const xmlHelper2 = new XmlHelper2(organizationSettings, selectedCourses.value, type);
  const xmlString = await xmlHelper2.generateXml();

  downloadXML(xmlString);
};

const downloadXML = (xmlString) => {
  // Get current date and time
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  // Format the date and time as DDMMYYHHMM
  const formattedDateTime = `${day}${month}${String(year).slice(2)}${hours}${minutes}`;

  // Create the filename
  const filename = `DELAKursexport${formattedDateTime}.xml`;

  // Create a Blob from the XML string
  const blob = new Blob([xmlString], { type: 'application/xml' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Append the link to the document, click it to start the download, then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const fetchOrganizationSettings = async () => {
  const { data, error } = await $supabase
    .from('organization_settings')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching organization settings:', error)
    return null
  }

  return data
}

const addSingleAppointment = () => {
  console.log('Adding single appointment');
};

// Update selected courses
const updateSelectedCourses = (updatedCourses) => {
  selectedCourses.value = updatedCourses;
};

// Toggle select all
const toggleSelectAll = () => {
  selectAll.value = !selectAll.value;
};
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold mb-4">Kurstermine</h1>
    <FilterSection :filters="filters" />
    <ActionButtons @action="handleActionEvent" @addSingleAppointment="addSingleAppointment" />
    <div class="overflow-x-auto">
      <KursTable
        :filteredKursData="filteredKursData"
        :selectAll="selectAll"
        :selectedCourses="selectedCourses"
        @toggleSelectAll="toggleSelectAll"
        @updateSelectedCourses="updateSelectedCourses"
      />
    </div>
  </div>
</template>
