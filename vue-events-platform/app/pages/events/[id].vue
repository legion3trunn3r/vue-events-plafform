<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <NuxtLink to="/" class="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8">
        <ArrowLeft class="w-5 h-5" />
        <span>Back to Events</span>
      </NuxtLink>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="flex space-x-2">
          <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>

      <div v-else-if="event">
        <!-- Event Header -->
        <div class="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md p-8 mb-8">
          <h1 class="text-4xl font-bold text-white mb-4">{{ event.title }}</h1>
          
          <!-- Event Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div class="flex items-center space-x-3">
              <Calendar class="w-5 h-5 text-blue-400" />
              <div>
                <p class="text-sm text-slate-400">Date & Time</p>
                <p class="text-white font-medium">{{ formatDate(event.date) }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <MapPin class="w-5 h-5 text-purple-400" />
              <div>
                <p class="text-sm text-slate-400">Location</p>
                <p class="text-white font-medium">{{ event.location }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <Users class="w-5 h-5 text-pink-400" />
              <div>
                <p class="text-sm text-slate-400">Guests</p>
                <p class="text-white font-medium">{{ event.guest_count || 0 }} / {{ event.max_guests }}</p>
              </div>
            </div>

            <div class="flex items-center space-x-3">
              <User class="w-5 h-5 text-green-400" />
              <div>
                <p class="text-sm text-slate-400">Organizer</p>
                <p class="text-white font-medium">{{ event.organizer?.name }}</p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="border-t border-slate-700/50 pt-6">
            <h2 class="text-xl font-bold text-white mb-3 flex items-center space-x-2">
              <FileText class="w-5 h-5" />
              <span>About This Event</span>
            </h2>
            <p class="text-slate-300 leading-relaxed">{{ event.description }}</p>
          </div>
        </div>

        <!-- Countdown Timer -->
        <div v-if="timeUntilEvent > 0" class="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md p-8 mb-8">
          <h2 class="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Clock class="w-5 h-5 text-blue-400" />
            <span>Event Starts In</span>
          </h2>
          <Timer :target-date="event.date" />
        </div>

        <!-- QR Code Section -->
        <div class="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md p-8">
          <h2 class="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <QrCode class="w-5 h-5 text-purple-400" />
            <span>Check-in QR Code</span>
          </h2>
          <p class="text-slate-400 mb-4">Share this QR code with guests for event check-in</p>
          <div class="bg-white p-8 rounded-lg w-64 mx-auto">
            <div class="bg-slate-200 w-full h-64 rounded-lg flex items-center justify-center">
              <span class="text-slate-600 text-sm">QR: {{ event.qr_code }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20">
        <AlertCircle class="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <p class="text-slate-400">Event not found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '../../types/index';
import { 
  ArrowLeft, Calendar, MapPin, Users, User, FileText, Clock, QrCode, AlertCircle 
} from 'lucide-vue-next';

// Применяем middleware для защиты страницы
definePageMeta({
  middleware: 'protected'
});

const route = useRoute();
const event = ref<Event | null>(null);
const isLoading = ref(true);

const timeUntilEvent = computed(() => {
  if (!event.value) return 0;
  const now = new Date();
  const eventDate = new Date(event.value.date);
  return eventDate.getTime() - now.getTime();
});

const formatDate = (date: Date | string) => {
  const eventDate = new Date(date);
  return eventDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const eventId = route.params.id;
    
    const response = await $fetch(`/api/events/${eventId}`);
    if (response.success && response.data) {
      event.value = response.data;
    }
  } catch (error) {
    console.error('Failed to load event:', error);
  } finally {
    isLoading.value = false;
  }
});

useHead({
  title: 'Event Details - Events Platform',
  meta: [
    { name: 'description', content: 'View event details and check-in' }
  ]
});
</script>
