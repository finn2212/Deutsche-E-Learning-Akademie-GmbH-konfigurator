<template>
  <div v-if="!selectedAnbieter">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">

          <h1 class="text-base font-semibold leading-6 text-gray-900">Bildungsanbieter</h1>
          <p class="mt-2 text-sm text-gray-700">A list of all the Bildungsanbieter in your account including their
            contact details.</p>
        </div>
      </div>
      <div class="mt-5 sm:mt-5 sm:flex-none">
        <input v-model="searchQuery" type="text" placeholder="Suche..."
          class="block rounded-md px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
      </div>

      <div class="mt-5 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Telefon Vorwahl</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Telefon Durchwahl
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Homepage</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="anbieter in paginatedFilteredAnbieter" :key="anbieter.id"
                  @click="showAnbieterDetails(anbieter)">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{
                    anbieter.name }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ anbieter.telefonvorwahl }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ anbieter.telefonDurchwahl }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ anbieter.homepage }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ anbieter.email }}</td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination Controls -->
            <div class="mt-4 flex justify-center">
              <button @click="prevPage" :disabled="currentPage === 1"
                class="mx-1 px-2 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded">Previous</button>

              <span v-for="page in displayedPages" :key="page" @click="goToPage(page)"
                class="mx-1 px-2 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded cursor-pointer"
                :class="{ 'bg-indigo-600 text-white': page === currentPage }">
                {{ page }}
              </span>

              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="mx-1 px-2 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <button @click="clearSelection" class="mb-4 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded">← Zurück zur Liste</button>
    <FilteredCourses :ban="selectedAnbieter" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import FilteredCourses from '@/components/kursnet/FilteredCourses.vue'

const { $supabase } = useNuxtApp()

const anbieterList = ref([])
const searchQuery = ref('') // Search input binding
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 25
const maxPagesToShow = 5
const selectedAnbieter = ref(null)


// Fetch Bildungsanbieter data from Supabase
const getAnbieterList = async () => {
  const { data, error } = await $supabase
    .from('bildungsanbieter')
    .select('*')

  if (!error && data) {
    anbieterList.value = data
  } else {
    console.error(error)
  }
  loading.value = false
}

// Filter function based on the search query
const filteredAnbieter = computed(() => {
  return anbieterList.value.filter(anbieter => {
    const search = searchQuery.value.toLowerCase()
    currentPage.value = 1
    return (
      anbieter.name.toLowerCase().includes(search) ||
      (anbieter.email && anbieter.email.toLowerCase().includes(search)) ||
      (anbieter.telefonVorwahl && anbieter.telefonVorwahl.toLowerCase().includes(search))
    )
  })
})

// Pagination logic for filtered results
const paginatedFilteredAnbieter = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAnbieter.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredAnbieter.value.length / itemsPerPage)
})

// Logic for displaying a limited number of pages
const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = maxPagesToShow
  const current = currentPage.value
  const total = totalPages.value

  // Always show first and last page
  pages.push(1)
  if (current > 3) {
    pages.push('...')
  }

  const startPage = Math.max(2, current - 2)
  const endPage = Math.min(total - 1, current + 2)

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (current < total - 2) {
    pages.push('...')
  }
  if (total > 1) {
    pages.push(total)
  }
  return pages
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  if (page !== '...') {
    currentPage.value = page
  }
}

onMounted(() => {
  getAnbieterList()
})

const showAnbieterDetails = (anbieter) => {
  selectedAnbieter.value = anbieter.id
}

const clearSelection = () => {
  selectedAnbieter.value = null
}
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left-color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>