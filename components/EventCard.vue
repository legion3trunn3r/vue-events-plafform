<template>
  <div class="group relative rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-md hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 overflow-hidden p-6">
    <!-- Gradient Border Effect -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 pointer-events-none rounded-2xl"></div>

    <div class="relative z-10">
      <!-- Event Header -->
      <div class="mb-4">
        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {{ event.title }}
        </h3>
        <p class="text-slate-400 text-sm line-clamp-2">
          {{ event.description }}
        </p>
      </div>

      <!-- Event Details -->
      <div class="space-y-3 mb-6 pb-4 border-b border-slate-700/50">
        <div class="flex items-center text-sm text-slate-300">
          <CalendarDays class="w-4 h-4 mr-3 text-blue-400" />
          <span>{{ formatDate(event.date) }}</span>
        </div>
        
        <div class="flex items-center text-sm text-slate-300">
          <MapPin class="w-4 h-4 mr-3 text-purple-400" />
          <span>{{ event.location }}</span>
        </div>
        
        <div class="flex items-center text-sm text-slate-300">
          <Users class="w-4 h-4 mr-3 text-pink-400" />
          <span class="flex-1">{{ event.guest_count || 0 }} / {{ event.max_guests }} guests</span>
          <div class="w-32 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
              :style="{ width: `${(event.guest_count || 0) / event.max_guests * 100}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Timer (if event is upcoming) -->
      <div v-if="timeUntilEvent > 0" class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
        <div class="text-center">
          <p class="text-xs text-blue-400 font-semibold mb-2 flex items-center justify-center space-x-1">
            <Clock class="w-3 h-3" />
            <span>Starts in</span>
          </p>
          <Timer :target-date="event.date" />
        </div>
      </div>

      <div v-else class="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3 mb-4 text-center">
        <p class="text-xs text-green-400 font-semibold flex items-center justify-center space-x-1">
          <CheckCircle class="w-3 h-3" />
          <span>Event Started</span>
        </p>
      </div>

      <!-- Event Actions -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-1 text-xs text-slate-400">
          <User class="w-3 h-3" />
          <span>{{ event.organizer?.name || 'Unknown' }}</span>
        </div>
        
        <button 
          @click="$emit('view-details', event.id)" 
          class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center space-x-2"
        >
          <span>Details</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '../types/index';
import { CalendarDays, MapPin, Users, Clock, CheckCircle, User, ArrowRight } from 'lucide-vue-next';

interface Props {
  event: Event;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'view-details': [eventId: number];
}>();

// Calculate time until event
const timeUntilEvent = computed(() => {
  const now = new Date();
  const eventDate = new Date(props.event.date);
  return eventDate.getTime() - now.getTime();
});

const formatDate = (date: Date | string) => {
  const eventDate = new Date(date);
  return eventDate.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
