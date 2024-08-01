<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Start</h1>
    <div class="mt-6">
      <h2 class="text-xl font-semibold">Schritte zur Konfiguration</h2>
      <ul class="list-decimal list-inside mt-2">
        <li class="mt-1">
          <strong>Schritt 1: Variablen definieren</strong> - Definieren Sie zunächst alle notwendigen Variablen, die für
          die Konfiguration Ihrer Kurse erforderlich sind. Dies umfasst alle spezifischen Parameter und Einstellungen,
          um möglichst Viele Kurse zu erzeigen.
        </li>
        <li class="mt-1">
          <strong>Schritt 2: Kurse anlegen</strong> - Erstellen und konfigurieren Sie Ihre Kurse basierend auf den zuvor
          definierten Variablen. Stellen Sie sicher, dass alle Kursdetails korrekt eingegeben werden, um eine
          reibungslose Integration in KURSNET zu gewährleisten.
        </li>
        <li class="mt-1">
          <strong>Schritt 3: Kurse exportieren</strong> - Sobald alle Kurse angelegt und überprüft sind, exportieren Sie
          die Daten in das XML-Format. Diese XML-Dateien können dann in KURSNET hochgeladen werden, um Ihre Angebote
          aktuell zu halten.
        </li>
      </ul>
    </div>
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
  router.push('/courses')
}
</script>
