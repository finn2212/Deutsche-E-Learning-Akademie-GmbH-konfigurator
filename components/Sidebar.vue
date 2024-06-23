<template>
    <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      <div class="flex h-16 shrink-0 items-center">
        <img class="h-8 w-auto" src="@/assets/dela_logo.webp" alt="Your Company" />
      </div>
      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              <li v-for="item in navigation" :key="item.name">
                <NuxtLink :to="item.href" :class="[item.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                  <component :is="item.icon" :class="[item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']" aria-hidden="true" />
                  {{ item.name }}
                </NuxtLink>
              </li>
            </ul>
          </li>
          <li class="mt-auto">
            <a href="#" @click="logout" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
              <Cog6ToothIcon class="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600" aria-hidden="true" />
              Einstellungen
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { NuxtLink } from '#components'
  import {
    Cog6ToothIcon,
    HomeIcon,
    UsersIcon,
  } from '@heroicons/vue/24/outline'
  
  const router = useRouter()
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: false },
    { name: 'Konfigurator', href: '/konfigurator', icon: UsersIcon, current: false },
  ]
  
  const logout = () => {
    // Handle logout logic here
    alert('Logged out')
    router.push('/login')
  }
  </script>
  