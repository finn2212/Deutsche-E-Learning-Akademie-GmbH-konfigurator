<script setup>
import { ref, computed, onMounted } from 'vue';
import FilterSection from '../components/config-termine/FilterSection.vue';
import ActionButtons from '../components/config-termine/ActionButtons.vue';
import KursTable from '../components/config-termine/KursTable.vue';
import ConfigBshTermine from '../components/config-termine/ConfigBshTermine.vue';
import { useNuxtApp } from '#app';
import XmlHelper2 from '../helper/xmlHelper2.0';
import { format } from 'date-fns';


const { $supabase } = useNuxtApp();
const kursData = ref([]);
const selectedCourses = ref([]);
const filters = ref({ kurs: "", standort: "", vzTz: "", startd: "", status: "" });
const selectAll = ref(false);

// State to control view mode (table view or config mode)
const isConfigMode = ref(false);

const fetchKursData = async () => {
  const { data, error } = await $supabase.from('all_termine').select('*');
  if (error) {
    console.error('Error fetching data:', error);
  } else {
    const { data: locations } = await $supabase.from('places').select('*');
    const { data: startTimes } = await $supabase.from('start_times').select('*');
    const { data: dates } = await $supabase.from('dates').select('*');

    kursData.value = data.map(item => {
      const location = locations.find(l => l.id === item.location_id);
      const startTime = startTimes.find(s => s.id === item.start_time_id);
      const date = dates.find(d => d.id === item.date_id);

      return {
        ...item,
        location_name: location ? location.name : '',
        start_time_label: startTime ? startTime.time : '',
        date_label: date
          ? `${format(new Date(date.start_date), 'dd.MM.yyyy')} - ${format(new Date(date.end_date), 'dd.MM.yyyy')}`
          : ''
      };
    });
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
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); 
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const formattedDateTime = `${day}${month}${String(year).slice(2)}${hours}${minutes}`;
  const filename = `DELAKursexport${formattedDateTime}.xml`;

  const blob = new Blob([xmlString], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

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

// Show ConfigBshTermine component and hide table view
const addSingleAppointment = () => {
  isConfigMode.value = true;
};

// Update selected courses
const updateSelectedCourses = (updatedCourses) => {
  selectedCourses.value = updatedCourses;
};

// Toggle select all
const toggleSelectAll = () => {
  selectAll.value = !selectAll.value;
};

// Function to return to the table view from ConfigBshTermine
const goBackToTable = () => {
  isConfigMode.value = false;
};

const deleteCourse = async (courseId) => {
  const { error } = await $supabase
    .from('all_termine')
    .delete()
    .eq('id', courseId);

  if (error) {
    console.error("Error deleting course:", error);
  } else {
    console.log(`Deleted course with ID: ${courseId}`);
    await fetchKursData(); // Refresh the table data after deletion
  }
};
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold mb-4">Kurstermine</h1>
    
    <!-- Show FilterSection, ActionButtons, and KursTable if not in config mode -->
    <div v-if="!isConfigMode">
      <FilterSection :filters="filters" />
      <ActionButtons @action="handleActionEvent" @addSingleAppointment="addSingleAppointment" />
      <div class="overflow-x-auto mt-5">
        <KursTable
          :filteredKursData="filteredKursData"
          :selectAll="selectAll"
          :selectedCourses="selectedCourses"
          @toggleSelectAll="toggleSelectAll"
          @updateSelectedCourses="updateSelectedCourses"
          @deleteCourse="deleteCourse"
        />
      </div>
    </div>

    <!-- Show ConfigBshTermine if in config mode -->
    <div v-else>
      <ConfigBshTermine @goBack="goBackToTable" />
    </div>
  </div>
</template>
