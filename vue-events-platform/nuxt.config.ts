// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-12-29',
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    // приватные ключи (доступны только на сервере)
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    databaseUrl: process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/vue_events_db',
    
    // публичные ключи (доступны в клиенте)
    public: {
      apiBase: '/api'
    }
  },

  css: [],

  // PostCSS настройки для Tailwind
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },

  // Настройка для работы с файлами
  nitro: {
    experimental: {
      openAPI: true
    }
  },

  // SSR конфигурация
  ssr: true,

  // TypeScript настройки
  typescript: {
    typeCheck: false
  }
})
