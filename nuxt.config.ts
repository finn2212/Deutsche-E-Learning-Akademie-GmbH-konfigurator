export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '@/assets/css/tailwind.css',
  ],
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  plugins: [
    { src: '~/plugins/supabase.js', mode: 'client' }
  ],
  router: {
    middleware: ['auth']
  },
})
