// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],

  supabase: {
    redirect: false, // we handle redirect via our own middleware
    clientOptions: {
      auth: {
        detectSessionInUrl: false, // prevent SSR from auto-exchanging the PKCE code (verifier lives in browser localStorage)
      },
    },
  },

  runtimeConfig: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    public: {},
  },
})
