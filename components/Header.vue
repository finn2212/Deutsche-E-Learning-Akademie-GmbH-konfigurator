<template>
    <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="$emit('toggle-sidebar')">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true" />
      </button>
      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
        <div class="flex items-center gap-x-4 lg:gap-x-6">
          <Menu as="div" class="relative">
            <MenuButton class="-m-1.5 flex items-center p-1.5">
              <span class="sr-only">Open user menu</span>
              <span class="hidden lg:flex lg:items-center">
                <span class="ml-4 text-sm font-semibold leading-6 text-gray-900">{{ userEmail }}</span>
                <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </MenuButton>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                  <a :href="item.href" :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']" @click.prevent="logout">{{ item.name }}</a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
  import {
    Bars3Icon,
    ChevronDownIcon,
  } from '@heroicons/vue/24/outline'
  
  const userEmail = ref('user@example.com')
  
  const userNavigation = [
    { name: 'Sign out', href: '#' },
  ]
  
  const router = useRouter()
  
  const logout = async () => {
    const { $supabase } = useNuxtApp()
    const { error } = await $supabase.auth.signOut()
    if (error) {
      alert(error.message)
    } else {
      router.push('/login')
    }
  }
  </script>
  