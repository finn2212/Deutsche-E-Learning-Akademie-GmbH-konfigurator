<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="@/assets/dela_logo.webp" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Login to Start</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="login">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">E-Mail Adresse</label>
          <div class="mt-2">
            <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Passwort</label>
            <div class="text-sm">
              <label href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password? Contact
                Admin</label>
            </div>
          </div>
          <div class="mt-2">
            <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <button type="submit"
            class="flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            <span v-if="!loading">Sign in</span>
            <Spinner v-if="loading" />
          </button>
        </div>
      </form>
      <div class="mt-6 text-center">
        <NuxtLink to="/register" class="font-semibold text-indigo-600 hover:text-indigo-500">Don't have an account?
          Register</NuxtLink>
      </div>
    </div>
  </div>
  <!-- <h1>Welcome to {{ subdomain }}</h1> -->
</template>

<script setup>
import { ref, onMounted, useAsyncData, useNuxtApp } from '#imports'
import { useRouter } from 'vue-router'
import Spinner from '@/components/layouts/Spinner.vue'

// Fetch the subdomain using useAsyncData to ensure it's available on the client side
const { data: ssrSubdomain } = useAsyncData('subdomain', async () => {
  const nuxtApp = useNuxtApp();
  return nuxtApp.ssrContext?.subdomain || 'default';
});

const subdomain = ref('');

onMounted(() => {
  subdomain.value = ssrSubdomain.value; // Set the subdomain value from SSR
  console.log('Initial client-side subdomain:', subdomain.value);
});

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

const login = async () => {
  loading.value = true
  const { $supabase } = useNuxtApp()
  const { error } = await $supabase.auth.signInWithPassword({ email: email.value, password: password.value })
  loading.value = false
  if (error) {
    alert(error.message)
  } else {
    router.push('/Start')
  }
}

definePageMeta({
  layout: false
})
</script>
