<template>
    <div class="mt-6">
      <h3 class="text-lg font-semibold mb-4">Export Verlauf</h3>
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Datum</th>
            <th class="py-2 px-4 border-b">Exportierte Kurse</th>
            <th class="py-2 px-4 border-b">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history in exportHistory" :key="history.id">
            <td class="py-2 px-4 border-b">{{ new Date(history.exported_at).toLocaleString() }}</td>
            <td class="py-2 px-4 border-b">
              <ul>
                <li v-for="course in history.exported_courses" :key="course.name">
                  {{ course.name }} ({{ course.prefix }})
                </li>
              </ul>
            </td>
            <td class="py-2 px-4 border-b">
              <button @click="deleteExportHistory(history.id)" class="text-red-600 underline">Löschen aus Verlauf</button>
            </td>
          </tr>
          <tr v-if="exportHistory.length === 0">
            <td colspan="3" class="py-2 px-4 text-center">Keine Exporte verfügbar</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useNuxtApp } from '#app'
  
  const { $supabase } = useNuxtApp()
  const exportHistory = ref([])
  
  onMounted(async () => {
    await fetchExportHistory() // Fetch export history on load
  })
  
  const fetchExportHistory = async () => {
    const { data, error } = await $supabase
      .from('export_history')
      .select('*')
      .order('exported_at', { ascending: false })
  
    if (!error && data) {
      exportHistory.value = data
    } else {
      console.error('Error fetching export history:', error)
    }
  }
  
  const deleteExportHistory = async (historyId) => {
    const { error } = await $supabase
      .from('export_history')
      .delete()
      .eq('id', historyId)
  
    if (error) {
      console.error('Error deleting export history:', error)
    } else {
      await fetchExportHistory() // Refresh the export history after deletion
    }
  }
  </script>
  