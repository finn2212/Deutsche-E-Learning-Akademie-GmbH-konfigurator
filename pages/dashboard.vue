<template>
    <div>
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
      <h2 class="text-xl font-semibold mt-4">Tool to download XML files to upload for thus: XML-Upload in KURSNET</h2>
      <p class="mt-2">
        Der XML-Upload ermöglicht es Ihnen als Bildungsanbieter, Ihre Angebote in KURSNET der Bundesagentur für Arbeit (BA) schnell und einfach zu pflegen.
      </p>
      <p class="mt-2">
        Der XML-Upload in KURSNET ist besonders vorteilhaft, wenn Sie viele Daten übertragen möchten oder Ihre Angebote häufig ändern.
      </p>
      <p class="mt-2">
        Für Angebote im Reha-Bereich gibt es zusätzliche Hinweise. Diese finden Sie auf der Seite Maßnahme-Daten pflegen für berufliche Rehabilitation.
      </p>
      <div class="mt-4">
        <button @click="startKonfiguration" class="px-4 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md">
          Start Konfiguration
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { definePageMeta } from '#imports'
  import { useRouter } from 'vue-router'
  
  definePageMeta({
    layout: 'default'
  })
  
  const router = useRouter()
  
  const startKonfiguration = () => {
    router.push('/konfigurator')
  }
  </script>
  