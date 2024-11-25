<template>
    <div>
      <!-- Back button -->
      <button
        @click="$emit('goBack')"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
      >
        Back
      </button>
  
      <!-- Title -->
      <h2 class="text-xl font-semibold mb-4">
        Detail View for {{ isEditing ? editableItem.title : item.title }}
      </h2>
  
      <!-- Edit/Save Toggle Button -->
      <button
        @click="toggleEditMode"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-4"
      >
        {{ isEditing ? "Save" : "Edit" }}
      </button>
  
      <!-- Display/Edit Form -->
      <form v-if="isEditing" @submit.prevent="saveChanges" class="space-y-4">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Kurs</label>
          <input
            v-model="editableItem.title"
            type="text"
            readonly
           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
  
        <!-- Location Dropdown -->
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700">Standort</label>
          <Dropdown v-model="editableItem.location_id" :options="locationOptions" />
        </div>
  
        <!-- Date Dropdown -->
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700">Startd</label>
          <Dropdown v-model="editableItem.date_id" :options="dateOptions" />
        </div>
  
        <!-- Instruction Form Dropdown -->
        <div>
          <label for="instruction_form" class="block text-sm font-medium text-gray-700">Instruction Form</label>
          <Dropdown v-model="editableItem.instruction_type1" :options="instructionFormOptions" />
        </div>
  
        <!-- Start and End Time -->
        <div class="flex space-x-4">
          <div>
            <label for="start_time" class="block text-sm font-medium text-gray-700">Start Zeit</label>
            <input
              v-model="editableItem.start_time"
              type="time"
              class="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="end_time" class="block text-sm font-medium text-gray-700">End Zeit</label>
            <input
              v-model="editableItem.end_time"
              type="time"
              class="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
  
        <!-- Submit Button -->
        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Save Changes
        </button>
      </form>
  
      <!-- Read-Only View -->
      <div v-else>
        <p><strong>ID:</strong> {{ item.id }}</p>
        <p><strong>Kurs:</strong> {{ item.title }}</p>
        <p><strong>Standort:</strong> {{ locationDetails?.name }}</p>
        <p><strong>Startd:</strong> {{ dateDetails?.start_date }}</p>
        <p><strong>Instruction Form:</strong> {{ instructionFormDetails?.name }}</p>
        <p><strong>Start Zeit:</strong> {{ item.start_time }}</p>
        <p><strong>End Zeit:</strong> {{ item.end_time }}</p>
        <p><strong>Länge:</strong> {{ item.type }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import Dropdown from "@/components/layouts/Dropdown.vue";
  import { useDates } from "@/composables/useDates";
  import { useCourseUtils } from "@/composables/useCourseUtils";
  import { useReferenceData } from "@/composables/useReferenceData";
  import { useNuxtApp } from "#app";
  
  const props = defineProps({
    item: Object,
  });
  
  const { $supabase } = useNuxtApp();
  const { fetchAllDates } = useDates();
  const { fetchAllLocations } = useCourseUtils();
  const { fetchTeachingForms } = useReferenceData();
  
  // State
  const isEditing = ref(false);
  const editableItem = ref({ ...props.item });
  const locationDetails = ref(null);
  const dateDetails = ref(null);
  const instructionFormDetails = ref(null);
  
  const locationOptions = ref([]);
  const dateOptions = ref([]);
  const instructionFormOptions = ref([]);
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing.value) saveChanges();
    isEditing.value = !isEditing.value;
  };
  
  // Save changes to the database
  const saveChanges = async () => {

    const selectedInstructionForm = instructionFormOptions.value.find(
    (option) => option.value === editableItem.value.instruction_type1
  );
    debugger
    const { error } = await $supabase
      .from("all_termine")
      .update({
        title: editableItem.value.title,
        location_id: editableItem.value.location_id,
        date_id: editableItem.value.date_id,
        instruction_type1: editableItem.value.instruction_type1,
        instruction_form: selectedInstructionForm ? selectedInstructionForm.label : null, 
        start_time: editableItem.value.start_time,
        end_time: editableItem.value.end_time,
      })
      .eq("id", editableItem.value.id);
  
    if (error) {
      console.error("Error saving changes:", error);
    } else {
      console.log("Changes saved successfully.");
    }
  };
  
  // Fetch dropdown options
  const fetchDropdownOptions = async () => {
    // Fetch locations
    locationOptions.value = (await fetchAllLocations()).map((loc) => ({
      value: loc.id,
      label: loc.name,
    }));
  
    // Fetch dates
    dateOptions.value = (await fetchAllDates()).map((date) => ({
      value: date.id,
      label: `${new Date(date.start_date).toLocaleDateString()} - ${new Date(
        date.end_date
      ).toLocaleDateString()}`,
    }));
  
    // Fetch instruction forms
    instructionFormOptions.value = (await fetchTeachingForms()).map((form) => ({
      value: form.id,
      label: form.text,
    }));

    editableItem.value.instruction_type1 = props.item.instruction_type1;
  };
  
  // Fetch details for read-only mode
  const fetchDetails = async () => {
    locationDetails.value = locationOptions.value.find(
      (loc) => loc.value === props.item.location_id
    );
    dateDetails.value = dateOptions.value.find((date) => date.value === props.item.date_id);
    instructionFormDetails.value = instructionFormOptions.value.find(
      (form) => form.value === props.item.instruction_form
    );
  };
  
  onMounted(async () => {
    await fetchDropdownOptions();
    await fetchDetails();

    debugger
  });
  </script>
  