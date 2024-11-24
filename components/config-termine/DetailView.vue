<template>
    <div>
        <button @click="$emit('goBack')" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4">
            Back
        </button>
        <h2 class="text-xl font-semibold mb-4">Detail View for {{ item.title }}</h2>
        <p><strong>ID:</strong> {{ item.id }}</p>
        <p><strong>Kurs:</strong> {{ item.title }}</p>
        <p><strong>Standort:</strong> {{ item.location_name }}</p>
        <p><strong>Startd:</strong> {{ item.date_label }}</p>
        <p><strong>Instruction Form:</strong> {{ item.instruction_form }}</p>
        <p><strong>Start Zeit:</strong> {{ item.start_time }}</p>
        <p><strong>End Zeit:</strong> {{ item.end_time }}</p>
        <p><strong>Länge:</strong> {{ item.type }}</p>

        <div v-if="dateDetails">
            <h3 class="text-lg font-semibold mt-4">Date Details</h3>
            <p><strong>Start Date:</strong> {{ formatDate(dateDetails.start_date) }}</p>
            <p><strong>End Date:</strong> {{ formatDate(dateDetails.end_date) }}</p>
        </div>

        <!-- Display Location Details -->
        <div v-if="locationDetails">
            <h3 class="text-lg font-semibold mt-4">Location Details</h3>
            <p><strong>Name:</strong> {{ locationDetails.name }}</p>
        </div>

        <!-- Display Course Type Details -->
        <div v-if="courseTypeDetails">
            <h3 class="text-lg font-semibold mt-4">Course Type Details</h3>
            <p><strong>Title:</strong> {{ courseTypeDetails.title }}</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { useCourseUtils } from '@/composables/useCourseUtils'; // Import the composable

const props = defineProps({
    item: Object
});

const {
    fetchCourseType,
    fetchLocationById,
    fetchDates
} = useCourseUtils(); // Destructure required functions from the composable

const courseTypeDetails = ref(null);
const dateDetails = ref(null);
const locationDetails = ref(null);

// Fetch course type details
const fetchCourseTypeDetails = async () => {
    courseTypeDetails.value = await fetchCourseType(props.item.course_type);
};

// Fetch date details
const fetchDateDetails = async () => {
    const [details] = await fetchDates([props.item.date_id]); // Use the composable function
    dateDetails.value = details;
};

// Fetch location details
const fetchLocationDetails = async () => {
    locationDetails.value = await fetchLocationById(props.item.location_id); // Use the composable function
};

// Format date
const formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

onMounted(() => {
    fetchCourseTypeDetails();
    fetchDateDetails();
    fetchLocationDetails();
});
</script>
