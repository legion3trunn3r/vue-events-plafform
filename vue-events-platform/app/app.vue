<template>
  <!-- Navigation Header -->
  <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gradient-to-b from-slate-900/90 to-slate-900/0 border-b border-slate-700/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-2">
          <NuxtLink to="/" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Sparkles class="w-6 h-6 text-white" />
            </div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Events Platform
            </h1>
          </NuxtLink>
        </div>
        
        <div class="flex items-center space-x-4">
          <div v-if="userStore.isAuthenticated" class="flex items-center space-x-3">
            <span class="text-sm text-slate-300">
              {{ userStore.userName }}
            </span>
            <NuxtLink 
              to="/events/create" 
              class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            >
              <Plus class="w-4 h-4 inline-block mr-2" />
              Create Event
            </NuxtLink>
            <button 
              @click="userStore.logout" 
              class="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 font-medium hover:bg-slate-600 transition-colors"
            >
              <LogOut class="w-4 h-4 inline-block mr-2" />
              Logout
            </button>
          </div>
          <div v-else class="flex items-center space-x-3">
            <NuxtLink to="/login" class="px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-colors">
              Sign In
            </NuxtLink>
            <NuxtLink to="/register" class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
              Sign Up
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Page Content -->
  <NuxtPage />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../components/stores/user';
import { Sparkles, Plus, LogOut } from 'lucide-vue-next';

const userStore = useUserStore();

// Инициализация пользователя при загрузке приложения
onMounted(async () => {
  await userStore.initializeFromToken();
});
</script>

<style scoped>
</style>
