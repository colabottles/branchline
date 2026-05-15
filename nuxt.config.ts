export default defineNuxtConfig({
  compatibilityDate: '2025-05-12',

  modules: [
    '@nuxtjs/supabase',
    '@nuxt/eslint',
  ],

  css: [
    '~/assets/css/main.css',
  ],

  runtimeConfig: {
    supabaseServiceKey: '',
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
  },

  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/'],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'branchline',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Realtime collaborative PR review, accessibility-first tool' },
        { name: 'color-scheme', content: 'dark' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Epilogue:wght@400;500;700;900&display=swap',
        },
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  vite: {
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {},
      },
    },
    css: {
      devSourcemap: true,
    },
  },

  devtools: { enabled: false },
})