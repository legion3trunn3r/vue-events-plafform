<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
          <Sparkles class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-white">Create Account</h1>
        <p class="text-slate-400 mt-2">Join Events Platform today</p>
      </div>

      <!-- Register Form -->
      <div class="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md p-8">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              <User class="w-4 h-4 inline-block mr-2" />
              Full Name
            </label>
            <input
              v-model="name"
              type="text"
              placeholder="John Doe"
              class="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

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
            <p class="text-xs text-slate-400 mt-1">Minimum 6 characters</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              <Lock class="w-4 h-4 inline-block mr-2" />
              Confirm Password
            </label>
            <input
              v-model="confirmPassword"
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

          <!-- Success Message -->
          <div v-if="success" class="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
            <CheckCircle class="w-4 h-4 inline-block mr-2" />
            {{ success }}
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <UserPlus class="w-4 h-4" v-if="!isLoading" />
            <span>{{ isLoading ? 'Creating account...' : 'Create Account' }}</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-slate-800/30 text-slate-400">Already have an account?</span>
          </div>
        </div>

        <!-- Sign In Link -->
        <NuxtLink
          to="/login"
          class="w-full py-2 rounded-lg border border-slate-700 text-white font-medium hover:bg-slate-700/50 transition-colors flex items-center justify-center space-x-2"
        >
          <LogIn class="w-4 h-4" />
          <span>Sign In</span>
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
import { Sparkles, User, Mail, Lock, UserPlus, AlertCircle, CheckCircle, LogIn, ArrowLeft } from 'lucide-vue-next';

const userStore = useUserStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  error.value = '';
  success.value = '';

  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  // Validate password length
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  isLoading.value = true;

  try {
    await userStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    });

    success.value = 'Account created successfully! Redirecting...';
    
    // Redirect to home after a short delay
    setTimeout(() => {
      navigateTo('/');
    }, 1500);
  } catch (err: any) {
    error.value = err.message || 'Failed to create account. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Sign Up - Events Platform',
  meta: [
    { name: 'description', content: 'Create a new Events Platform account' }
  ]
});
</script>
