<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
          <Sparkles class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-white">Sign In</h1>
        <p class="text-slate-400 mt-2">Welcome back to Events Platform</p>
      </div>

      <!-- Login Form -->
      <div class="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md p-8">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              <Mail class="w-4 h-4 inline-block mr-2" />
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              <Lock class="w-4 h-4 inline-block mr-2" />
              Password
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle class="w-4 h-4 inline-block mr-2" />
            {{ error }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <LogIn class="w-4 h-4" v-if="!isLoading" />
            <span>{{ isLoading ? 'Signing in...' : 'Sign In' }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-slate-800/30 text-slate-400">Don't have an account?</span>
          </div>
        </div>

        <!-- Sign Up Link -->
        <NuxtLink
          to="/register"
          class="w-full py-2 rounded-lg border border-slate-700 text-white font-medium hover:bg-slate-700/50 transition-colors flex items-center justify-center space-x-2"
        >
          <UserPlus class="w-4 h-4" />
          <span>Create Account</span>
        </NuxtLink>
      </div>

      <!-- Back to Home -->
      <div class="mt-6 text-center">
        <NuxtLink to="/" class="text-slate-400 hover:text-white transition-colors flex items-center justify-center space-x-2">
          <ArrowLeft class="w-4 h-4" />
          <span>Back to Home</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../components/stores/user';
import { Sparkles, Mail, Lock, LogIn, AlertCircle, UserPlus, ArrowLeft } from 'lucide-vue-next';

// Отключаем middleware для этой страницы
definePageMeta({
  middleware: []
});

const userStore = useUserStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    await userStore.login({
      email: email.value,
      password: password.value
    });

    // Redirect to home on success
    await navigateTo('/');
  } catch (err: any) {
    error.value = err.message || 'Failed to sign in. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Sign In - Events Platform',
  meta: [
    { name: 'description', content: 'Sign in to your Events Platform account' }
  ]
});
</script>
