// nuxt.config.js
export default {
  ssr: true,
  target: 'server', // Ensure your target is set to 'server' for full SSR capabilities
  plugins: [
    { src: '~/plugins/supabase.js', mode: 'client' },
    '~/plugins/vue-multiselect.js'
  ],
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  css: [
    '@/assets/css/tailwind.css',
  ],
  runtimeConfig: {
    public: {
      SERVERURL: process.env.SERVERURL
    }
  },
  router: {
    middleware: ['auth', 'subdomain'] // Ensure your subdomain middleware is correctly referenced
  },
  head: {
    script: [
      {
        src: "https://app.getterms.io/cookie-consent/embed/58238475-1bb5-4745-8cd8-667f773c422b/en-us",
        type: "text/javascript",
        defer: true // Optional: Ensures the script is loaded after the DOM is parsed
      }
    ]
  },
  devtools: true
}
