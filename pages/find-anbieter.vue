<template>
    <div>
      <h1>Anbieter Suche</h1>
      <form @submit.prevent="startAnbieterSuche">
        <div>
          <label for="start_id">Start-ID:</label>
          <input v-model="start_id" type="number" id="start_id" required />
        </div>
        <div>
          <label for="end_id">End-ID:</label>
          <input v-model="end_id" type="number" id="end_id" required />
        </div>
        <button type="submit">Suche starten</button>
      </form>
  
      <h2>Verarbeitungsstatus:</h2>
      <div ref="logWindow" class="log-window">
        <div v-for="message in messages" :key="message" class="log-message">
          {{ message }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue'
  
  // Variablen für die Start- und End-IDs und die Nachrichten
  const start_id = ref(1)
  const end_id = ref(10)
  const messages = ref([])
  const logWindow = ref(null)  // Ref für das Log-Fenster
  const config = useRuntimeConfig()
  
  // Funktion zum Scrollen des Log-Fensters zum unteren Ende
  const scrollToBottom = () => {
    if (logWindow.value) {
      logWindow.value.scrollTop = logWindow.value.scrollHeight
    }
  }
  
  // Funktion zum Starten der Anbieter-Suche
  const startAnbieterSuche = () => {
    // Öffne eine EventSource-Verbindung
    const eventSource = new EventSource(`${config.public.SERVERURL}/find-anbieter?start_id=${start_id.value}&end_id=${end_id.value}`)
  
    // Füge einen Listener für eingehende Nachrichten hinzu
    eventSource.onmessage = function (event) {
      messages.value.push(event.data)
  
      // Warte, bis die DOM-Updates abgeschlossen sind und scrolle dann nach unten
      nextTick(() => {
        scrollToBottom()
      })
    }
  
    // Füge einen Fehler-Listener hinzu, um Fehler zu behandeln
    eventSource.onerror = function () {
      eventSource.close()
    }
  }
  </script>
  
  <style scoped>
  h1 {
    font-family: Arial, sans-serif;
  }
  
  form {
    margin-bottom: 20px;
  }
  
  label {
    font-weight: bold;
  }
  
  input {
    margin-bottom: 10px;
    padding: 5px;
    width: 100%;
    max-width: 300px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #333;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #555;
  }
  
  h2 {
    margin-top: 20px;
  }
  
  .log-window {
    height: 300px;
    overflow-y: auto;
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    white-space: pre-wrap;
  }
  
  .log-message {
    margin-bottom: 5px;
  }
  </style>
  