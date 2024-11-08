<template>
  <tr class="odd:bg-gray-100 even:bg-gray-50">
    <td class="px-4 py-2 border-b text-center">
      <input
        type="checkbox"
        :checked="isSelected"
        @change="toggleSelection"
        class="form-checkbox"
      />
    </td>
    <td class="px-4 py-2 border-b text-center">{{ item.id }}</td>
    <td class="px-4 py-2 border-b">{{ item.title }}</td>
    <td class="px-4 py-2 border-b">{{ item.location_name || item.location_id }}</td> <!-- Display location name -->
    <td class="px-4 py-2 border-b text-center">{{ item.type }}</td>
    <td class="px-4 py-2 border-b text-center">{{ item.date_label || item.date_id }}</td> <!-- Display date label -->
    <td class="px-4 py-2 border-b text-center">{{ item.start_time_label || item.start_time_id }}</td> <!-- Display start time label -->
    <td class="px-4 py-2 border-b text-center">{{ item.status }}</td>
    <td class="px-4 py-2 border-b text-center">
      <button @click="handleDelete" class="text-red-500 hover:text-red-700">
        🗑️
      </button>
    </td>
  </tr>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  item: Object,
  isSelected: Boolean
});

const emit = defineEmits(['selectCourse', 'deleteCourse']);

const toggleSelection = () => {
  emit('selectCourse', props.item.id, !props.isSelected);
};

const handleDelete = () => {
  emit('deleteCourse', props.item.id);
};
</script>
