<template>
    <div>
        <div class="flex flex-col">
            <!-- Top Section: Text -->
            <div class="flex justify-start mb-4">
                <div v-if="!selectedDate" class="text-lg font-semibold">
                    Datum Wählen
                </div>
                <div v-else class="text-lg font-semibold">
                    {{ selectedCourses.length }} Termine mit dem neuen Datum
                    {{ selectedDate.start_date || '...' }} bis {{ selectedDate.end_date || '...' }}
                    zum kopieren ausgewählt
                </div>
            </div>

            <!-- Bottom Section: Buttons -->
            <div class="flex justify-start">
                <button @click="$emit('goBack')"
                    class="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 mr-5">Back</button>
                <button @click="saveTermineWithNewDate"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Kopiere Termine
                </button>
            </div>
        </div>
        <!-- Dates Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 mt-5">
                <thead>
                    <tr>
                        <th class="px-4 py-2 border-b text-left">Select</th>
                        <th class="px-4 py-2 border-b text-left">Start Date</th>
                        <th class="px-4 py-2 border-b text-left">End Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="date in dates" :key="date.id" class="hover:bg-gray-100">
                        <!-- Single Select Column -->
                        <td class="px-4 py-2 border-b">
                            <input type="radio" :value="date" v-model="selectedDate" />
                        </td>
                        <td class="px-4 py-2 border-b">{{ date.start_date }}</td>
                        <td class="px-4 py-2 border-b">{{ date.end_date }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Add New Date Form -->
        <div class="mt-5">
            <h2 class="text-xl font-semibold mb-4">Add New Date</h2>
            <form @submit.prevent="addNewDate" class="space-y-4">
                <div>
                    <label for="start_date" class="block text-sm font-medium text-gray-700">Start Date</label>
                    <input id="start_date" v-model="newDate.start_date" type="date" required
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                    <label for="end_date" class="block text-sm font-medium text-gray-700">End Date</label>
                    <input id="end_date" v-model="newDate.end_date" type="date" required
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Save New Date
                </button>
            </form>
        </div>

    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useTermine } from '@/composables/useTermine';


const emit = defineEmits(['goBack']);
const { fetchAllDates, saveDate } = useDates();
const { getElementsByArray, saveElements } = useTermine();

const props = defineProps({
    course: Object,
    selectedCourses: Array
})

const termine = ref([]);
const dates = ref([]);
const selectedDate = ref(null);
const newDate = ref({ start_date: '', end_date: '' });

// Add new date to the database
const addNewDate = async () => {
    if (!newDate.value.start_date || !newDate.value.end_date) {
        console.warn('Both start_date and end_date are required.');
        return;
    }
    await saveDate(newDate.value);
    dates.value = await fetchAllDates(); g

};

// Save Termine with new date_id
const saveTermineWithNewDate = async () => {
    if (!selectedDate.value) {
        console.warn('No date selected.');
        return;
    }

    // Update all termine with the new date_id and remove the id field
    const updatedTermine = termine.value.map(({ id, ...termin }) => ({
        ...termin,
        date_id: selectedDate.value.id, // Assign selectedDate.id
    }));

    // Save all updated termine to the database
    const success = await saveElements(updatedTermine);

    if (success) {
        console.log('All termine saved successfully!');
        emit('goBack'); // Navigate back after saving
    } else {
        console.error('Failed to save termine.');
    }
};

onMounted(async () => {
    if (props.selectedCourses?.length) {
        // Use the `useTermine` composable
        termine.value = await getElementsByArray(props.selectedCourses); // Fetch termine data
        dates.value = await fetchAllDates();
    } else {
        console.warn('No selectedCourses provided.');
    }
})
</script>

<style scoped>
/* Optional: Add any specific styles for this component */
</style>