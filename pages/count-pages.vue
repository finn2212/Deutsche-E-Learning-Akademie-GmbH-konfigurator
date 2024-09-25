<template>
    <div>
        <h1>Count Pages</h1>

        <form @submit.prevent="fetchPages">
            <div>
                <label for="sys">Systematik (sys):</label>
                <input v-model="params.sys" type="text" id="sys" placeholder="z.B. C">
            </div>
            <div>
                <label for="sw">Suchwort (sw):</label>
                <input v-model="params.sw" type="text" id="sw" placeholder="z.B. Teilqualifikation">
            </div>
            <div>
                <label for="ssw">Sternchen-Suchwort (ssw):</label>
                <input v-model="params.ssw" type="text" id="ssw" placeholder="z.B. Teilqualifi">
            </div>
            <div>
                <label for="ids">Berufs-ID (ids):</label>
                <input v-model="params.ids" type="text" id="ids" placeholder="z.B. 6133">
            </div>
            <div>
                <label for="orte">Ort (orte):</label>
                <input v-model="params.orte" type="text" id="orte" placeholder="z.B. Erlangen_11.005_49.595">
            </div>
            <div>
                <label for="uk">Umkreis (uk):</label>
                <input v-model="params.uk" type="text" id="uk" placeholder="z.B. 50">
            </div>
            <div>
                <label for="ortsunabhaengig">Ortsunabhängigkeit (ortsunabhaengig):</label>
                <input v-model="params.ortsunabhaengig" type="text" id="ortsunabhaengig" placeholder="true/false">
            </div>
            <div>
                <label for="re">Region (re):</label>
                <input v-model="params.re" type="text" id="re" placeholder="z.B. BER">
            </div>
            <div>
                <label for="bt">Beginntermin (bt):</label>
                <input v-model="params.bt" type="text" id="bt" placeholder="z.B. 0">
            </div>
            <div>
                <label for="uz">Unterrichtszeit (uz):</label>
                <input v-model="params.uz" type="text" id="uz" placeholder="z.B. 1">
            </div>
            <div>
                <label for="dauer">Dauer (dauer):</label>
                <input v-model="params.dauer" type="text" id="dauer" placeholder="z.B. 1,2">
            </div>
            <div>
                <label for="uf">Unterrichtsform (uf):</label>
                <input v-model="params.uf" type="text" id="uf" placeholder="z.B. 101">
            </div>
            <div>
                <label for="ban">Anbieter-ID (ban):</label>
                <input v-model="params.ban" type="text" id="ban" placeholder="z.B. 22210">
            </div>
            <div>
                <label for="it">Integrationstyp (it):</label>
                <input v-model="params.it" type="text" id="it" placeholder="z.B. RC,RD">
            </div>
            <div>
                <label for="bg">Bildungsgutschein (bg):</label>
                <input v-model="params.bg" type="text" id="bg" placeholder="true/false">
            </div>
            <div>
                <label for="sort">Sortierung (sort):</label>
                <input v-model="params.sort" type="text" id="sort" placeholder="z.B. std">
            </div>

            <button type="submit">Count Pages</button>
        </form>

        <p>Total Pages: {{ totalPages }}</p>
        <p>Total Elements: {{ totalElements }}</p>
        <!-- Verwende die JsonViewer-Komponente hier -->
        <vue-json-pretty :data="fullResponse._value" :deep="true"></vue-json-pretty>

    </div>
</template>
<script setup>
import { ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'


const totalPages = ref(0)
const totalElements = ref(0)
const fullResponse = ref('')

const params = ref({
    sys: '',
    sw: '',
    ssw: '',
    ids: '',
    orte: '',
    uk: '',
    ortsunabhaengig: '',
    re: '',
    bt: '',
    uz: '',
    dauer: '',
    uf: '',
    ban: '',
    it: '',
    bg: '',
    sort: ''
})

const config = useRuntimeConfig()

const fetchPages = async () => {
    try {
        // Filtere die leeren Parameter heraus
        const filteredParams = Object.fromEntries(Object.entries(params.value).filter(([key, value]) => value))

        // Anfrage an den Flask-Server
        const queryParams = new URLSearchParams(filteredParams).toString()
        const response = await fetch(`${config.public.SERVERURL}/count-pages?${queryParams}`)
        const data = await response.json()

        // Ergebnis im Frontend anzeigen
        if (data.error) {
            console.error(`Fehler: ${data.error}`)
        } else {
            totalPages.value = data.total_pages
            totalElements.value = data.total_elements
            fullResponse.value = JSON.stringify(data.full_response, null, 2) // Zeige die gesamte Antwort als JSON an
            console.log(data.full_response._embedded.termine[0])  // Protokolliere die gesamte API-Antwort
        }
    } catch (error) {
        console.error(`Fehler bei der Anfrage: ${error}`)
    }
}
</script>

<style scoped>
h1 {
    font-family: Arial, sans-serif;
    color: #333;
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
    box-sizing: border-box;
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

pre {
    background-color: #f5f5f5;
    padding: 10px;
    border-radius: 5px;
}
</style>
