<template>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">{{ isEditMode ? 'Edit Course Type' : 'Create New Course Type' }}</h2>
        </div>
        <form @submit.prevent="submitForm">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <!-- Text Fields -->
                <div class="mb-4">
                    <label for="teachingTypes" class="block text-sm font-medium text-gray-700">Kursart</label>
                    <select v-model="selectedOfferType" @change="updateOfferType"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="" disabled>Select Offer Type</option>
                        <option v-for="offerType in offerTypes" :key="offerType.id" :value="offerType.id">{{
                            offerType.text }}</option>
                    </select>
                </div>
                <!-- Education Types Dropdown -->
                <div class="mb-4">
                    <label for="education_type" class="block text-sm font-medium text-gray-700">Education Type</label>
                    <select v-model="selectedEducationType" @change="updateEducationTypeText"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="" disabled>Select Education Type</option>
                        <option v-for="education in educationTypes" :key="education.id" :value="education.id">{{
                            education.text }}</option>
                    </select>
                </div>

                <!-- TeachingTypes Types Dropdown -->
                <div class="mb-4">
                    <label for="teachingTypes" class="block text-sm font-medium text-gray-700">Teaching Types</label>
                    <select v-model="selectedTeachingForm" @change="updateTeachingForms"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="" disabled>Select Education Type</option>
                        <option v-for="teachingType in teachingForms" :key="teachingType.id" :value="teachingType.id">{{
                            teachingType.text }}</option>
                    </select>
                </div>

                <!-- Founding Types Dropdown -->
                <div class="mb-4">
                    <label for="teachingTypes" class="block text-sm font-medium text-gray-700">Founding Type</label>
                    <select v-model="selectedFundingType" @change="updateFundingType"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="" disabled>Select Funding Type</option>
                        <option v-for="fundingType in fundingTypes" :key="fundingType.id" :value="fundingType.id">{{
                            fundingType.text }}</option>
                    </select>
                </div>

                <!-- Search Component for ref entries -->
                <div class="mb-4">
                    <label for="search" class="block text-sm font-medium text-gray-700">Search Entries</label>
                    <input v-model="searchQuery" @input="handleSearch" type="text" id="search"
                        placeholder="Search by Group Description"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    <ul v-if="suggestions.length"
                        class="border border-gray-300 rounded-md mt-2 bg-white shadow-sm max-h-48 overflow-y-auto">
                        <li v-for="(suggestion, index) in suggestions" :key="index"
                            @click="selectSuggestion(suggestion)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            {{ suggestion.ref_group_description }} - {{ suggestion.ref_group_name }}
                        </li>
                    </ul>
                </div>
                <div v-for="(label, field) in textFields" :key="field" class="mb-4">
                    <label :for="field" class="block text-sm font-medium text-gray-700">{{ label }}</label>
                    <input v-model="formData[field]" type="text" :id="field"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>


                <!-- Textarea Fields -->
                <div v-for="(label, field) in textareaFields" :key="field" class="mb-4">
                    <label :for="field" class="block text-sm font-medium text-gray-700">{{ label }}</label>
                    <textarea v-model="formData[field]" :id="field"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>

                <!-- Number Field -->
                <div class="mb-4">
                    <label for="price_amount" class="block text-sm font-medium text-gray-700">Price Amount</label>
                    <input v-model="formData.price_amount" type="number" step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <!-- Checkbox Fields -->
                <div v-for="(label, field) in checkboxFields" :key="field" class="mb-4">
                    <label :for="field" class="block text-sm font-medium text-gray-700">{{ label }}</label>
                    <input v-model="formData[field]" type="checkbox" :id="field" class="mt-1 block" />
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end">
                <button @click="closeForm" class="text-gray-500 hover:text-gray-700 focus:outline-none">
                    Cancel
                </button>
                <button type="submit" class="px-4 ml-5 py-2 bg-green-600 text-white rounded">Save</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useReferenceData } from '@/composables/useReferenceData';

const props = defineProps({
    course: Object,
    isEditMode: Boolean
});

const emit = defineEmits(['closeForm', 'saveCourse']);

const { fetchEducationTypes, fetchTeachingForms, fetchRefGroups, fetchRefGroupById, fetchOfferTypes, fetchFederalFundingTypes } = useReferenceData();
const educationTypes = ref([]);
const teachingForms = ref([]);
const offerTypes = ref([])
const fundingTypes = ref([])
const selectedEducationType = ref("")
const selectedTeachingForm = ref("")
const selectedOfferType = ref("");
const selectedFundingType = ref("");
const searchQuery = ref("");
const suggestions = ref([]);
const selectedSuggestion = ref(null);


onMounted(async () => {
    educationTypes.value = await fetchEducationTypes();
    teachingForms.value = await fetchTeachingForms();
    offerTypes.value = await fetchOfferTypes();
    fundingTypes.value = await fetchFederalFundingTypes();
    // Set initial values for dropdowns in edit mode
    if (props.isEditMode && props.course) {
        selectedEducationType.value = props.course.education_type2 || "";
        selectedTeachingForm.value = props.course.instruction_type1 || "";
        selectedOfferType.value = props.course.course_type || "";
        selectedFundingType.value = props.course.funding_type_id || "";

        const savedGroup = await fetchRefGroupById(props.course.classification_group_id);
        if (savedGroup) {
            selectedSuggestion.value = savedGroup;
            searchQuery.value = `${savedGroup.ref_group_description} - ${savedGroup.ref_group_name}`;
        }
    }
});

// Search functionality

const handleSearch = async () => {
    if (searchQuery.value.length >= 2) { // Start searching after 3 characters
        suggestions.value = await fetchRefGroups(searchQuery.value);
    } else {
        suggestions.value = []; // Clear suggestions if query is too short
    }
};

const selectSuggestion = (suggestion) => {
    selectedSuggestion.value = suggestion;
    searchQuery.value = `${suggestion.ref_group_description} - ${suggestion.ref_group_name}`;
    suggestions.value = []; // Clear suggestions
    formData.value.classification_group_id = suggestion.id
    formData.value.fvalue = suggestion.ref_group_description
    formData.value.fname = suggestion.ref_group_name
};
// Form data structure
const formData = ref({
    course_type: '',
    title: '',
    description_long: '',
    requirements: '',
    keywords_group: '',
    target_group_text: '',
    degree_type1: '',
    degree_title: '',
    degree_type2: '',
    examiner: '',
    degree_add_qualification: '',
    degree_entitled: '',
    subsidy_description: '',
    instruction_form: '',
    instruction_type1: '',
    instruction_type2: '',
    inhouse_seminar: false,
    extra_occupational: false,
    practical_part: false,
    education_type1: '',
    education_type2: '',
    duration_type: '',
    flexible_start: false,
    segment_type2: '',
    reference_classification_system_name: '',
    fname: '',
    fvalue: '',
    price_amount: 0,
    price_currency: 'EUR',
    measure_number: '',
    manual_id: '',
    classification_group_id: "",
    funding_type_id: "",
    funding_type_name: ""
});

// Define field labels for reusability
const textFields = {
    title: 'Title',
    degree_type1: 'Degree Type 1',
    degree_title: 'Degree Title',
    degree_type2: 'Degree Type 2',
    examiner: 'Examiner',
    degree_add_qualification: 'Degree Add Qualification',
    degree_entitled: 'Degree Entitled',
    instruction_type2: 'Instruction Type 2',
    duration_type: 'Duration Type',
    segment_type2: 'Segment Type 2',
    reference_classification_system_name: 'Reference Classification System Name',
    price_currency: 'Price Currency',
    measure_number: 'Measure Number',
    manual_id: 'Manual Kurs ID'
};

const textareaFields = {
    description_long: 'Description Long',
    requirements: 'Requirements',
    keywords_group: 'Keywords Group',
    target_group_text: 'Target Group Text',
    subsidy_description: 'Subsidy Description',
};

const checkboxFields = {
    inhouse_seminar: 'Inhouse Seminar',
    extra_occupational: 'Extra Occupational',
    practical_part: 'Practical Part',
    flexible_start: 'Flexible Start'
};

const updateEducationTypeText = () => {
    const selectedEducation = educationTypes.value.find(item => item.id === selectedEducationType.value);
    formData.value.education_type1 = selectedEducation ? selectedEducation.text : '';
    formData.value.education_type2 = selectedEducation ? selectedEducation.id : '';
};

const updateTeachingForms = () => {
    const selectedTeachingForm = teachingForms.value.find(item => item.id === selectedTeachingForm.value);
    formData.value.instruction_type1 = selectedTeachingForm ? selectedTeachingForm.id : '';
    formData.value.instruction_form = selectedTeachingForm ? selectedTeachingForm.text : '';
};
const updateOfferType = () => {
    const selectedOffer = offerTypes.value.find(item => item.id === selectedOfferType.value);
    formData.value.course_type = selectedOffer.id;
};

const updateFundingType = () => {
    const selectedFunding = fundingTypes.value.find(item => item.id === selectedFundingType.value);
    formData.value.funding_type_id = selectedFunding.id;
    formData.value.funding_type_name = selectedFunding.text;
};

// Update form data when course prop changes
watch(() => props.course, (newCourse) => {
    formData.value = newCourse ? { ...newCourse } : {};
}, { immediate: true });

// Close form handler
const closeForm = () => {
    emit('closeForm');
};

// Form submission handler
const submitForm = () => {
    emit('saveCourse', formData.value);
};
</script>

<style scoped>
/* Optional styles for form */
</style>