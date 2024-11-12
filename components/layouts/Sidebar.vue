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
              <NuxtLink :to="item.href"
                :class="[item.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                <component :is="item.icon"
                  :class="[item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']"
                  aria-hidden="true" />
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>
        </li>
        <li>
          <div class="text-xs font-semibold leading-6 text-gray-400">Variables</div>
          <ul role="list" class="-mx-2 mt-2 space-y-1">
            <li v-for="variable in variables" :key="variable.name">
              <NuxtLink :to="variable.href"
                :class="[variable.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                <component :is="variable.icon"
                  :class="[variable.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']"
                  aria-hidden="true" />
                {{ variable.name }}
              </NuxtLink>
            </li>
          </ul>
        </li>
        <li v-if="userRole === Roles.SUPER_ADMIN">
          <div class="text-xs font-semibold leading-6 text-gray-400">Kursnet</div>
          <ul role="list" class="-mx-2 mt-2 space-y-1">
            <li v-for="setting in kursnet" :key="setting.name">
              <NuxtLink :to="setting.href"
                :class="[setting.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                <component :is="setting.icon"
                  :class="[setting.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']"
                  aria-hidden="true" />
                {{ setting.name }}
              </NuxtLink>
            </li>
          </ul>
        </li>
        <li>
          <div class="text-xs font-semibold leading-6 text-gray-400">Fixe Einstellungen</div>
          <ul role="list" class="-mx-2 mt-2 space-y-1">
            <li v-for="setting in settings" :key="setting.name">
              <NuxtLink :to="setting.href"
                :class="[setting.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                <component :is="setting.icon"
                  :class="[setting.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']"
                  aria-hidden="true" />
                {{ setting.name }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NuxtLink } from '#components'
import { HomeIcon, FolderIcon, CogIcon, FlagIcon, IdentificationIcon, LinkIcon, UserGroupIcon, ClockIcon } from '@heroicons/vue/24/outline'
import { useAuth } from '~/composables/useAuth';
import { Roles } from '~/utils/roles';  // Import the Roles enum

const navigation = [
  { name: 'Start', href: '/Start', icon: HomeIcon, current: false },
  { name: 'Kurse Konfiguieren', href: '/config-courses', icon: FolderIcon, current: false },
  { name: 'Termine Konfiguieren', href: '/config-termine', icon: FolderIcon, current: false },
]

const variables = [
  { name: 'Startzeiten', href: '/variables/startzeit', icon: ClockIcon, current: false },
  { name: 'Daten', href: '/variables/dates', icon: ClockIcon, current: false },
  { name: 'Art des Kurses', href: '/variables/vollzeit-teilzeit', icon: IdentificationIcon, current: false },
  { name: 'Ort des Kurses', href: '/variables/ort', icon: FlagIcon, current: false },


]

const kursnet = [
  { name: 'Anbieter finden', href: '/find-anbieter', icon: UserGroupIcon, current: false },
  { name: 'Seiten Zählen', href: '/count-pages', icon: LinkIcon, current: false },
  { name: 'Alle Anbieter', href: '/all-anbieter', icon: LinkIcon, current: false },

]

const settings = [
  { name: 'Organisations Einstellungen', href: '/variables/organisations-einstellungen', icon: UserGroupIcon, current: false },
  { name: 'Kurs Typen', href: '/variables/fixe-kurse-variablen', icon: LinkIcon, current: false },
]

const { userRole, fetchUserRole } = useAuth(); 
//await fetchUserRole();
</script>
