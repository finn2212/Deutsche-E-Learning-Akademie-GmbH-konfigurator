<template>
    <div>
      <TransitionRoot as="template" :show="sidebarOpen">
        <Dialog class="relative z-70 lg:hidden" @close="sidebarOpen = false">
          <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-gray-900/80" />
          </TransitionChild>
  
          <div class="fixed inset-0 flex">
            <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
              <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                  <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                      <span class="sr-only">Close sidebar</span>
                      <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
                <Sidebar />
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
  
      <!-- Static sidebar for desktop -->
      <div class="hidden lg:fixed lg:inset-y-0 lg:z-70 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>
  
      <div class="lg:pl-72">
        <Header @toggle-sidebar="sidebarOpen = true" :userEmail="userEmail" />
        <main class="py-10">
          <div class="px-4 sm:px-6 lg:px-8">
            <NuxtPage />
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNuxtApp } from '#app'
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
  import { XMarkIcon } from '@heroicons/vue/24/outline'
  import Sidebar from '@/components/layouts/Sidebar.vue'
  import Header from '@/components/layouts/Header.vue'
  
  const sidebarOpen = ref(false)
  const userEmail = ref('')
  const router = useRouter()
  
  onMounted(async () => {
    const { $supabase } = useNuxtApp()
    const { data: { session } } = await $supabase.auth.getSession()
  
    if (!session) {
      router.push('/login')
    } else {
      userEmail.value = session.user.email
    }
  })
  </script>
  