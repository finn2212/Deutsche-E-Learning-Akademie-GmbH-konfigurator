<template>
  <div>
    <h2>User Role: {{ userRole }}</h2> <!-- This will display the user role -->
    <h2>Manuell Job starten</h2>
    <form @submit.prevent="startJobManually">
      <div>
        <label for="manual_start_id">Start-ID:</label>
        <input v-model="manual_start_id" type="number" id="manual_start_id" required />
      </div>
      <div>
        <label for="manual_end_id">End-ID:</label>
        <input v-model="manual_end_id" type="number" id="manual_end_id" required />
      </div>
      <button type="submit">Job manuell starten</button>
    </form>

    <h2>Verarbeitungsstatus:</h2>
    <div ref="logWindow" class="log-window">
      <div v-for="message in messages" :key="message" class="log-message">
        {{ message }}
      </div>
    </div>

    <!-- New section for job logs -->
    <h2>Job Logs</h2>
    <table>
      <thead>
        <tr>
          <th>Job Name</th>
          <th>New IDs</th>
          <th>Updated IDs</th>
          <th>Timeouts</th>
          <th>Passed IDs</th>
          <th>Job Duration (s)</th>
          <th>Status</th>
          <th>Date</th>
          <th>Job Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobLogs" :key="job.id">
          <td>{{ job.job_name }}</td>
          <td>{{ job.new_ids }}</td>
          <td>{{ job.updated_ids }}</td>
          <td>{{ job.timeouts }}</td>
          <td>{{ job.passed_ids }}</td>
          <td>{{ job.job_duration }}</td>
          <td>{{ job.status }}</td>
          <td>{{ new Date(job.job_date).toLocaleString() }}</td>
          <td>{{ job.job_type }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { jwtDecode } from 'jwt-decode';



// Variables for the start and end IDs, job logs, and messages
const manual_start_id = ref(1);
const manual_end_id = ref(10);
const messages = ref([]);
const logWindow = ref(null);
const jobLogs = ref([]);
const loading = ref(true);
const userRole = ref('');  // Variable to store the user role
const { $supabase } = useNuxtApp();
const config = useRuntimeConfig();

// Fetch job logs on component mount and fetch user role
onMounted(async () => {
  fetchJobLogs();
  await fetchUserRole();  // Fetch user role on component mount
});

// Function to scroll the log window to the bottom
const scrollToBottom = () => {
  if (logWindow.value) {
    logWindow.value.scrollTop = logWindow.value.scrollHeight;
  }
};

// Function to start the manual job
const startJobManually = async () => {
  try {
    const response = await fetch(`${config.public.SERVERURL}/manual-anbieter-job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start_id: manual_start_id.value,
        end_id: manual_end_id.value,
      })
    });

    if (response.ok) {
      const data = await response.json();
      messages.value.push(`Manueller Job gestartet: Start-ID ${manual_start_id.value}, End-ID ${manual_end_id.value}`);
    } else {
      messages.value.push(`Fehler beim Starten des Jobs: ${response.statusText}`);
    }

    nextTick(() => scrollToBottom());
  } catch (error) {
    messages.value.push(`Fehler: ${error.message}`);
    nextTick(() => scrollToBottom());
  }
};

// Function to fetch the user's role from the JWT
const fetchUserRole = async () => {
  
  const { data: session } = await $supabase.auth.getSession();
  if (session && session.session.access_token) {
    const decodedToken = jwtDecode(session.session.access_token);  // Decode JWT to extract claims
    userRole.value = decodedToken.user_role || 'No role found';  // Set the user role or default message
  }
};

// Function to fetch and display job logs from Supabase
const fetchJobLogs = async () => {
  loading.value = true;
  const { data, error } = await $supabase
    .from('job_logs')  // Make sure the table name matches your schema
    .select('*')
    .order('job_date', { ascending: false });

  if (error) {
    console.error('Error fetching job logs:', error);
    messages.value.push('Fehler beim Abrufen der Job-Logs');
  } else {
    jobLogs.value = data;
  }
  loading.value = false;
};
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

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
