// nuxt.config.js
export default {
  ssr: true,
  target: 'server', // Ensure your target is set to 'server' for full SSR capabilities
  plugins: [
    { src: '~/plugins/supabase.js', mode: 'client' }
  ],
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  css: [
    '@/assets/css/tailwind.css',
  ],
  router: {
    middleware: ['auth', 'subdomain'] // Ensure your subdomain middleware is correctly referenced
  },
  devtools: true
}
