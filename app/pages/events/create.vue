<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <NuxtLink to="/" class="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8">
        <ArrowLeft class="w-5 h-5" />
        <span>Back to Events</span>
      </NuxtLink>

      <!-- Event Details Card -->
      <div class="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md p-8">
        <h1 class="text-4xl font-bold text-white mb-4">Create Event</h1>
        <p class="text-slate-400 mb-8">Fill in the details to create a new event</p>

        <form @submit.prevent="handleCreateEvent" class="space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              <Type class="w-4 h-4 inline-block mr-2" />
              Event Title
            </label>
            <input
              v-model="formData.title"
              type="text"
              placeholder="My Amazing Event"
              class="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              <FileText class="w-4 h-4 inline-block mr-2" />
              Description
            </label>
            <textarea
              v-model="formData.description"
              placeholder="Describe your event..."
              rows="4"
              class="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors resize-none"
              required
            ></textarea>
          </div>

          <!-- Date -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              <Calendar class="w-4 h-4 inline-block mr-2" />
              Event Date
            </label>
            <input
              v-model="formData.date"
              type="datetime-local"
              class="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              <MapPin class="w-4 h-4 inline-block mr-2" />
              Location
            </label>
            <input
              v-model="formData.location"
              type="text"
              placeholder="Event location or address"
              class="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <!-- Max Guests -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">
              <Users class="w-4 h-4 inline-block mr-2" />
              Maximum Guests
            </label>
            <input
              v-model.number="formData.max_guests"
              type="number"
              min="1"
              placeholder="100"
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
            class="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Plus class="w-5 h-5" v-if="!isLoading" />
            <span>{{ isLoading ? 'Creating...' : 'Create Event' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ArrowLeft, Type, FileText, Calendar, MapPin, Users, AlertCircle, Plus 
} from 'lucide-vue-next';

// Применяем middleware для защиты страницы
definePageMeta({
  middleware: 'protected'
});

const formData = ref({
  title: '',
  description: '',
  date: '',
  location: '',
  max_guests: 50
});

const error = ref('');
const isLoading = ref(false);

const handleCreateEvent = async () => {
  error.value = '';
  isLoading.value = true;

  try {
    // Here you would make an API call to create the event
    const response = await $fetch('/api/events', {
      method: 'POST',
      body: {
        ...formData.value,
        date: new Date(formData.value.date).toISOString()
      }
    });

    if (response.success) {
      await navigateTo('/');
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to create event';
  } finally {
    isLoading.value = false;
  }
};

useHead({
  title: 'Create Event - Events Platform',
  meta: [
    { name: 'description', content: 'Create a new event on Events Platform' }
  ]
});
</script>
