<template>
  <table class="min-w-full bg-white border border-gray-200">
    <thead>
      <tr>
        <th class="px-4 py-2 border-b">
          <input
            type="checkbox"
            :checked="selectAll"
            @change="toggleSelectAll"
            class="form-checkbox"
          />
        </th>
        <th class="px-4 py-2 border-b">ID</th>
        <th class="px-4 py-2 border-b">Kurs</th>
        <th class="px-4 py-2 border-b">Standort</th>
        <th class="px-4 py-2 border-b">Vz/Tz</th>
        <th class="px-4 py-2 border-b">Start Datum</th>
        <th class="px-4 py-2 border-b">Start Zeit.</th>
        <th class="px-4 py-2 border-b">Status</th>
        <th class="px-4 py-2 border-b">Aktionen</th>
      </tr>
    </thead>
    <tbody>
      <TableRow
        v-for="item in filteredKursData"
        :key="item.id"
        :item="item"
        :isSelected="selectedCourses.includes(item.id)"
        @selectCourse="updateSelectedCourses"
        @deleteCourse="emitDeleteCourse"
      />
    </tbody>
  </table>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import TableRow from './TableRow.vue';

const props = defineProps({
  filteredKursData: Array,
  selectAll: Boolean,
  selectedCourses: Array,
});

const emit = defineEmits(['toggleSelectAll', 'updateSelectedCourses', 'deleteCourse']);

// Toggle select all functionality
const toggleSelectAll = () => {
  if (props.selectAll) {
    emit('updateSelectedCourses', []);
  } else {
    emit('updateSelectedCourses', props.filteredKursData.map(item => item.id));
  }
  emit('toggleSelectAll');
};

// Update selected courses when a row is selected/deselected
const updateSelectedCourses = (courseId, isSelected) => {
  const updatedCourses = isSelected
    ? [...props.selectedCourses, courseId]
    : props.selectedCourses.filter(id => id !== courseId);

  emit('updateSelectedCourses', updatedCourses);
};

// Emit delete event to the parent component
const emitDeleteCourse = (courseId) => {
  emit('deleteCourse', courseId); // Emit the deleteCourse event to the main page component
};
</script>
