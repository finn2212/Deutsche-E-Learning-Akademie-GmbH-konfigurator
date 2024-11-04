<template>
    <div>
      <h1>Kurse von Anbieter: {{ courses[0]?.angebot.bildungsanbieter.name }}</h1>
      <h1>Anzahl an Kursen: {{ courses.length }}</h1>
  
      <!-- List of courses -->
      <ul v-if="courses.length && !selectedCourse">
        <li v-for="course in courses" :key="course.id" @click="showDetails(course)">
          <p><strong>Titel: </strong>{{ course.angebot.titel }}</p>
          <p><strong>Kosten: </strong>{{ course.kostenWertCluster }}</p>
          <p><strong>Ort: </strong>{{ course.adresse?.bezeichnung }}</p>
        </li>
      </ul>
  
      <!-- Course Details View -->
      <div v-if="selectedCourse" class="course-details">
        <button @click="clearSelection" class="mb-4 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded">← Zurück zur Liste</button>
        <h2>{{ selectedCourse.angebot.titel }}</h2>
        <p><strong>Systematik: </strong>{{ selectedCourse.angebot?.systematiken[0].codeNr }}</p>
        <p><strong>Beschreibung: </strong></p>
        <div v-html="selectedCourse.angebot.inhalt"></div>
        <p><strong>Ort: </strong>{{ selectedCourse.adresse?.bezeichnung }}</p>
        <p><strong>Kosten: </strong>{{ selectedCourse.kostenWertCluster }}</p>
        <p><strong>Abschluss: </strong>{{ selectedCourse.angebot.abschlussbezeichnung }}</p>
        <button @click="closeDetails">Schließen</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  const courses = ref([]);
  const selectedCourse = ref(null);
  const route = useRoute();
  const props = defineProps({
  ban: Number
})
  const config = useRuntimeConfig()
  
  // Fetch courses when the component mounts
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${config.public.SERVERURL}/count-pages?ban=${props.ban}`);  // Your API endpoint for courses
      const data = await response.json();
      courses.value = data.full_response._embedded.termine;  // Map your API response to the courses array
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const clearSelection = () => {
    selectedCourse.value = null
}
  
  onMounted(() => {
    fetchCourses();
  });
  
  // Show course details
  const showDetails = (course) => {
    selectedCourse.value = course;
  };
  
  // Close course details
  const closeDetails = () => {
    selectedCourse.value = null;
  };
  </script>
  
  <style scoped>
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    cursor: pointer;
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
  }
  
  .course-details {
    margin-top: 20px;
    border: 1px solid #ccc;
    padding: 20px;
    background-color: #f9f9f9;
  }
  </style>
  