<script setup>
import { ref, computed, onMounted } from 'vue';
import FilterSection from '../components/config-termine/FilterSection.vue';
import ActionButtons from '../components/config-termine/ActionButtons.vue';
import KursTable from '../components/config-termine/KursTable.vue';
import ConfigBshTermine from '../components/config-termine/ConfigBshTermine.vue';
import { useNuxtApp } from '#app';
import XmlHelper2 from '../helper/xmlHelper2.0';
import { format } from 'date-fns';
import DetailView from '../components/config-termine/DetailView.vue';


const { $supabase } = useNuxtApp();
const kursData = ref([]);
const selectedCourses = ref([]);
const selectAll = ref(false);
const selectedItem = ref(null);

// State to control view mode (table view or config mode)
const isConfigMode = ref(false);

const filters = ref({
  kurs: { label: 'Kurs', value: '', class: 'block w-48', options: [{ value: '', label: 'All' }] },
  standort: { label: 'Standort', value: '', class: 'block w-48', options: [{ value: '', label: 'All' }] },
  vzTz: { label: 'Vz/Tz', value: '', class: 'block w-48', options: [{ value: '', label: 'All' }, { value: 'Vz', label: 'Vollzeit' }, { value: 'Tz', label: 'Teilzeit' }] },
  startd: { label: 'Startd.', value: '', class: 'block w-48', type: 'date', options: [{ value: '', label: 'All' }] },
  status: { label: 'Status', value: '', class: 'block w-48', options: [{ value: '', label: 'All' }, { value: 'Aktiv', label: 'Aktiv' }, { value: 'Inaktiv', label: 'Inaktiv' }] }
});


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

const loadFilterOptions = async () => {
  try {
    // Fetch all values, then filter unique ones in JavaScript

    // Fetch kurs options
    const { data: kursData, error: kursError } = await $supabase
      .from('course_types')
      .select('title');

    // Fetch standort options
    const { data: standortData, error: standortError } = await $supabase
      .from('places')
      .select('name');

    // Fetch startd options
    const { data: startdData, error: startdError } = await $supabase
      .from('dates')
      .select('id');

    // Check for errors and handle them
    if (kursError || standortError || startdError) {
      console.error("Error fetching filter data:", kursError || standortError || startdError);
      return;
    }

    // Create unique filter options by removing duplicates and mapping correctly
    filters.value.kurs.options = [
      { value: '', label: 'All' },
      ...Array.from(new Set(kursData.map(k => k.title))).map(value => ({ value, label: value }))
    ];
    filters.value.standort.options = [
      { value: '', label: 'All' },
      ...Array.from(new Set(standortData.map(s => s.name))).map(value => ({ value, label: value }))
    ];
    filters.value.startd.options = [
      { value: '', label: 'All' },
      ...Array.from(new Set(startdData.map(d => d.id))).map(value => ({ value, label: value }))
    ];
  } catch (error) {
    console.error("Error loading filter options:", error);
  }
};



onMounted(() => {
  fetchKursData();
  loadFilterOptions();
});

const filteredKursData = computed(() => {
  return kursData.value.filter(item => {
    return (
      (filters.value.kurs.value === "" || item.title === filters.value.kurs.value) && // Assumes 'title' is the field for 'kurs'
      (filters.value.standort.value === "" || item.location_name === filters.value.standort.value) && // 'location_name' for 'standort'
      (filters.value.vzTz.value === "" || item.type === filters.value.vzTz.value) &&
      (filters.value.startd.value === "" || item.date_label.includes(filters.value.startd.value)) && // 'date_label' for 'startd'
      (filters.value.status.value === "" || item.status === filters.value.status.value)
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

  downloadXML(xmlString, type);
};

const downloadXML = (xmlString, type) => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(2); // Get last two digits of the year
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  // Format date as "dd.mm.yy_hh:mm"
  const formattedDateTime = `${day}-${month}-${year}_${hours}-${minutes}`;

  let filename = "";
  if (type === "new") {
    filename = `Neulieferung_rsexport_vom_${formattedDateTime}.xml`;
  } else if (type === "update") {
    filename = `Differenzlierferung_Kursexport_vom_${formattedDateTime}.xml`;
  }


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
  selectedItem.value = null;
  fetchKursData()

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

const handleFilterUpdate = ({ key, value }) => {
  filters.value[key].value = value;
};

const openDetails = (item) => {
  selectedItem.value = item;
  isConfigMode.value = true; // Show detail view
};
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold mb-4">Kurstermine</h1>

    <!-- Show FilterSection, ActionButtons, and KursTable if not in config mode -->
    <div v-if="!isConfigMode">
      <FilterSection :filters="filters" @updateFilter="handleFilterUpdate" />
      <ActionButtons @action="handleActionEvent" @addSingleAppointment="addSingleAppointment" />
      <div class="overflow-x-auto mt-5">
        <KursTable :filteredKursData="filteredKursData" :selectAll="selectAll" :selectedCourses="selectedCourses"
          @toggleSelectAll="toggleSelectAll" @updateSelectedCourses="updateSelectedCourses" @deleteCourse="deleteCourse"
          @openDetails="openDetails" />
      </div>
    </div>
    <DetailView v-else-if="selectedItem" :item="selectedItem" @goBack="goBackToTable" />
    <!-- Show ConfigBshTermine if in config mode -->
    <div v-else>
      <ConfigBshTermine @goBack="goBackToTable" />
    </div>
  </div>
</template>
