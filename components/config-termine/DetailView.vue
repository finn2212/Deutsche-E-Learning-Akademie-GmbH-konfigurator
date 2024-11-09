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

        <div v-if="dateDetails">
            <h3 class="text-lg font-semibold mt-4">Date Details</h3>
            <p><strong>Start Date:</strong> {{ formatDate(dateDetails.start_date) }}</p>
            <p><strong>End Date:</strong> {{ formatDate(dateDetails.end_date) }}</p>
        </div>

        <!-- Display Location Details -->
        <div v-if="locationDetails">
            <h3 class="text-lg font-semibold mt-4">Location Details</h3>
            <p><strong>Name:</strong> {{ locationDetails.name }}</p>
            <p><strong>Street:</strong> {{ locationDetails.strasse }} {{ locationDetails.hausnummer }}</p>
            <p><strong>ZIP Code:</strong> {{ locationDetails.plz }}</p>
            <p><strong>City:</strong> {{ locationDetails.ort }}</p>
            <p><strong>State:</strong> {{ locationDetails.bundesland }}</p>
            <p><strong>Country:</strong> {{ locationDetails.land }}</p>
        </div>

        <!-- Display Course Type Details -->
        <div v-if="courseTypeDetails">
            <h3 class="text-lg font-semibold mt-4">Course Type Details</h3>
            <p><strong>Title:</strong> {{ courseTypeDetails.title }}</p>
            <p><strong>Description:</strong> {{ courseTypeDetails.description_long }}</p>
            <p><strong>Requirements:</strong> {{ courseTypeDetails.requirements }}</p>
            <p><strong>Keywords:</strong> {{ courseTypeDetails.keywords_group }}</p>
            <p><strong>Target Group:</strong> {{ courseTypeDetails.target_group_text }}</p>
            <p><strong>Degree Type 1:</strong> {{ courseTypeDetails.degree_type1 }}</p>
            <p><strong>Degree Title:</strong> {{ courseTypeDetails.degree_title }}</p>
            <p><strong>Degree Type 2:</strong> {{ courseTypeDetails.degree_type2 }}</p>
            <p><strong>Examiner:</strong> {{ courseTypeDetails.examiner }}</p>
            <p><strong>Degree Additional Qualification:</strong> {{ courseTypeDetails.degree_add_qualification }}</p>
            <p><strong>Degree Entitled:</strong> {{ courseTypeDetails.degree_entitled }}</p>
            <p><strong>Subsidy Description:</strong> {{ courseTypeDetails.subsidy_description }}</p>
            <p><strong>Instruction Form:</strong> {{ courseTypeDetails.instruction_form }}</p>
            <p><strong>Instruction Type 1:</strong> {{ courseTypeDetails.instruction_type1 }}</p>
            <p><strong>Instruction Form Name:</strong> {{ courseTypeDetails.instruction_form_name }}</p>
            <p><strong>Instruction Type 2:</strong> {{ courseTypeDetails.instruction_type2 }}</p>
            <p><strong>Inhouse Seminar:</strong> {{ courseTypeDetails.inhouse_seminar ? 'Yes' : 'No' }}</p>
            <p><strong>Extra Occupational:</strong> {{ courseTypeDetails.extra_occupational ? 'Yes' : 'No' }}</p>
            <p><strong>Practical Part:</strong> {{ courseTypeDetails.practical_part ? 'Yes' : 'No' }}</p>
            <p><strong>Education Type 1:</strong> {{ courseTypeDetails.education_type1 }}</p>
            <p><strong>Education Type 2:</strong> {{ courseTypeDetails.education_type2 }}</p>
            <p><strong>Duration Type:</strong> {{ courseTypeDetails.duration_type }}</p>
            <p><strong>Flexible Start:</strong> {{ courseTypeDetails.flexible_start ? 'Yes' : 'No' }}</p>
            <p><strong>Segment Type 2:</strong> {{ courseTypeDetails.segment_type2 }}</p>
            <p><strong>Reference Classification System Name:</strong> {{
                courseTypeDetails.reference_classification_system_name }}</p>
            <p><strong>Fname:</strong> {{ courseTypeDetails.fname }}</p>
            <p><strong>Fvalue:</strong> {{ courseTypeDetails.fvalue }}</p>
            <p><strong>Price Amount:</strong> {{ courseTypeDetails.price_amount }}</p>
            <p><strong>Type:</strong> {{ courseTypeDetails.type }}</p>
            <p><strong>Price Currency:</strong> {{ courseTypeDetails.price_currency }}</p>
            <p><strong>Measure Number:</strong> {{ courseTypeDetails.measure_number }}</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const props = defineProps({
    item: Object
});

const { $supabase } = useNuxtApp();
const courseTypeDetails = ref(null);
const dateDetails = ref(null);
const locationDetails = ref(null);

const fetchCourseTypeDetails = async () => {
    const { data, error } = await $supabase
        .from('course_types')
        .select('*')
        .eq('id', props.item.course_type)
        .single();

    if (error) {
        console.error("Error fetching course type details:", error);
    } else {
        courseTypeDetails.value = data;
    }
};

const fetchDateDetails = async () => {
    const { data, error } = await $supabase
        .from('dates')
        .select('start_date, end_date')
        .eq('id', props.item.date_id)
        .single();

    if (error) {
        console.error("Error fetching date details:", error);
    } else {
        dateDetails.value = data;
    }
};

// Fetch location details
const fetchLocationDetails = async () => {
    const { data, error } = await $supabase
        .from('places')
        .select('name, strasse, hausnummer, plz, ort, bundesland, land')
        .eq('id', props.item.location_id)
        .single();

    if (error) {
        console.error("Error fetching location details:", error);
    } else {
        locationDetails.value = data;
    }
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