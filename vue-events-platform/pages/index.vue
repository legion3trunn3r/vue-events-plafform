<template>
  <div>
    <!-- Hero Section with Animated Background -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <!-- Animated background elements -->
      <div class="absolute inset-0 opacity-50">
        <div class="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div class="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 text-center max-w-4xl mx-auto">
        <div class="inline-block mb-6 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md">
          <span class="text-sm text-slate-300 flex items-center space-x-2">
            <Zap class="w-4 h-4 text-blue-400" />
            <span>Launch Your Next Event</span>
          </span>
        </div>

        <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Create Unforgettable Moments
        </h1>
        
        <p class="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Plan, manage, and execute amazing micro-events with our powerful platform. Track guest registrations with QR codes in real-time.
        </p>

        <div v-if="!userStore.isAuthenticated" class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <NuxtLink to="/register" class="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center space-x-2">
            <ArrowRight class="w-5 h-5" />
            <span>Get Started</span>
          </NuxtLink>
          <NuxtLink to="/login" class="px-8 py-3 rounded-lg bg-slate-700/50 text-white font-medium border border-slate-600 hover:bg-slate-700 transition-all duration-300 flex items-center justify-center space-x-2">
            <LogIn class="w-5 h-5" />
            <span>Sign In</span>
          </NuxtLink>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 md:gap-8 justify-center max-w-2xl mx-auto">
          <div class="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 backdrop-blur-md">
            <div class="text-2xl md:text-3xl font-bold text-blue-400">1000+</div>
            <div class="text-sm text-slate-400">Events Created</div>
          </div>
          <div class="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 backdrop-blur-md">
            <div class="text-2xl md:text-3xl font-bold text-purple-400">50K+</div>
            <div class="text-sm text-slate-400">Happy Users</div>
          </div>
          <div class="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 backdrop-blur-md">
            <div class="text-2xl md:text-3xl font-bold text-pink-400">98%</div>
            <div class="text-sm text-slate-400">Success Rate</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="relative py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="mb-12">
          <h2 class="text-4xl font-bold text-white mb-2">
            {{ userStore.isAuthenticated ? 'Your Events' : 'Featured Events' }}
          </h2>
          <p class="text-slate-400">
            {{ userStore.isAuthenticated ? 'Manage and track all your events' : 'Explore amazing events happening now' }}
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="flex space-x-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="events.length === 0" class="text-center py-16 rounded-2xl border border-slate-700/50 bg-slate-800/20 backdrop-blur-md">
          <Calendar class="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <p class="text-slate-400 mb-6">
            {{ userStore.isAuthenticated ? 'No events yet. Create your first one!' : 'No events available right now' }}
          </p>
          <div v-if="userStore.isAuthenticated">
            <NuxtLink to="/events/create" class="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
              <Plus class="w-5 h-5" />
              <span>Create First Event</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Events Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCard 
            v-for="event in events" 
            :key="event.id" 
            :event="event"
            @view-details="viewEventDetails"
          />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="relative py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p class="text-slate-400 max-w-2xl mx-auto">
            Everything you need to create and manage amazing events
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Feature 1 -->
          <div class="group p-8 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CalendarDays class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Event Creation</h3>
            <p class="text-slate-400">
              Create events with detailed descriptions, photos, and custom settings in minutes
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="group p-8 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md hover:border-purple-500/50 hover:bg-slate-800/50 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <QrCode class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white mb-2">QR Code Check-in</h3>
            <p class="text-slate-400">
              Generate unique QR codes for guest check-ins and track attendance in real-time
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="group p-8 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md hover:border-pink-500/50 hover:bg-slate-800/50 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Live Countdown</h3>
            <p class="text-slate-400">
              Display real-time countdown timers to build excitement for your upcoming events
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="group p-8 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md hover:border-green-500/50 hover:bg-slate-800/50 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Guest Management</h3>
            <p class="text-slate-400">
              Easily manage guest lists, RSVP tracking, and send invitations to attendees
            </p>
          </div>

          <!-- Feature 5 -->
          <div class="group p-8 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Image class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Photo Gallery</h3>
            <p class="text-slate-400">
              Upload and manage event photos, create galleries, and share memories with guests
            </p>
          </div>

          <!-- Feature 6 -->
          <div class="group p-8 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300">
            <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Analytics</h3>
            <p class="text-slate-400">
              Get insights into attendee behavior, engagement metrics, and event performance
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative py-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="relative rounded-3xl border border-slate-700/50 bg-gradient-to-r from-slate-800/50 via-slate-800/30 to-slate-800/50 backdrop-blur-md overflow-hidden">
          <!-- Gradient border effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative p-12 text-center">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Create Amazing Events?
            </h2>
            <p class="text-slate-400 mb-8">
              Join thousands of event organizers who are already creating unforgettable experiences
            </p>
            <NuxtLink v-if="!userStore.isAuthenticated" to="/register" class="inline-flex items-center space-x-2 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
              <Rocket class="w-5 h-5" />
              <span>Start Creating Now</span>
            </NuxtLink>
            <NuxtLink v-else to="/events/create" class="inline-flex items-center space-x-2 px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300">
              <Plus class="w-5 h-5" />
              <span>Create Your Event</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-md py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 class="font-bold text-white mb-4">Events Platform</h4>
            <p class="text-slate-400 text-sm">
              Create and manage amazing micro-events with ease
            </p>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Product</h4>
            <ul class="space-y-2 text-slate-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Company</h4>
            <ul class="space-y-2 text-slate-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">About</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-white mb-4">Legal</h4>
            <ul class="space-y-2 text-slate-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-slate-700/50 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; 2025 Events Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../components/stores/user';
import type { Event } from '../types/index';
import { 
  Zap, ArrowRight, LogIn, Calendar, 
  CalendarDays, QrCode, Clock, Users, Image, BarChart3, Plus, Rocket 
} from 'lucide-vue-next';

// Отключаем middleware для этой страницы
definePageMeta({
  middleware: []
});

const userStore = useUserStore();
const events = ref<Event[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  await loadEvents();
});

const loadEvents = async () => {
  try {
    isLoading.value = true;
    
    const endpoint = userStore.isAuthenticated ? '/api/events/my' : '/api/events';
    const eventsData = await $fetch<{ success: boolean; data?: Event[] }>(endpoint);
    
    if (eventsData.success && eventsData.data) {
      events.value = eventsData.data;
    }
  } catch (error) {
    console.error('Failed to load events:', error);
  } finally {
    isLoading.value = false;
  }
};

const viewEventDetails = (eventId: number) => {
  navigateTo(`/events/${eventId}`);
};

useHead({
  title: 'Events Platform - Create Unforgettable Moments',
  meta: [
    { name: 'description', content: 'Create and manage amazing micro-events with QR code check-ins, guest tracking, and real-time analytics' },
    { name: 'keywords', content: 'events, micro-events, event management, QR code, registration, social events' }
  ]
});
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
