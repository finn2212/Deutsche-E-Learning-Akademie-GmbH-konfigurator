<template>
  <tr class="odd:bg-gray-100 even:bg-gray-50 cursor-pointer" >
    <td class="px-4 py-2 border-b text-left">
      <input type="checkbox" :checked="isSelected" @change="toggleSelection" @click.stop class="form-checkbox" />
    </td>
    <td class="px-4 py-2 border-b text-left">{{ item.id }}</td>
    <td class="px-4 py-2 border-b text-left">{{ item.title }}</td>
    <td class="px-4 py-2 border-b text-left">{{ item.location_name || item.location_id }}</td>
    <td class="px-4 py-2 border-b text-left">{{ item.instruction_form }}</td>
    <td class="px-4 py-2 border-b text-left">{{ item.type }}</td>
    <td class="px-4 py-2 border-b text-left">{{ item.date_label || item.date_id }}</td>
    <td class="px-4 py-2 border-b text-left">{{ item.start_time_label || item.start_time_id }}</td>
    <td class="px-4 py-2 border-b text-left">{{ item.status }}</td>
    <td class="px-4 py-2 border-b text-left">
      <div class="flex space-x-2">
        <button @click="edit" class="text-blue-500 hover:text-blue-700">✏️</button>
        <button @click.stop="handleDelete" class="text-red-500 hover:text-red-700">🗑️</button>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  item: Object,
  isSelected: Boolean
});

const emit = defineEmits(['selectCourse', 'deleteCourse', 'edit']);

const toggleSelection = () => {
  emit('selectCourse', props.item.id, !props.isSelected);
};

const handleDelete = () => {
  emit('deleteCourse', props.item.id);
};
const edit = () => {
  emit('edit', props.item);
};

</script>
