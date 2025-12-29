<template>
  <div class="card hover:shadow-lg transition-shadow duration-200">
    <!-- Event Header -->
    <div class="mb-4">
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        {{ event.title }}
      </h3>
      <p class="text-gray-600 text-sm line-clamp-3">
        {{ event.description }}
      </p>
    </div>

    <!-- Event Details -->
    <div class="space-y-3 mb-4">
      <div class="flex items-center text-sm text-gray-500">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{{ formatDate(event.date) }}</span>
      </div>
      
      <div class="flex items-center text-sm text-gray-500">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{{ event.location }}</span>
      </div>
      
      <div class="flex items-center text-sm text-gray-500">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <span>{{ event.guest_count || 0 }} / {{ event.max_guests }} гостей</span>
      </div>
    </div>

    <!-- Timer (if event is upcoming) -->
    <div v-if="timeUntilEvent > 0" class="bg-blue-50 rounded-lg p-3 mb-4">
      <div class="text-center">
        <p class="text-xs text-blue-600 font-medium mb-1">До начала ивента:</p>
        <Timer :target-date="event.date" />
      </div>
    </div>

    <!-- Event Actions -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <div class="flex items-center space-x-2">
        <span class="text-xs text-gray-500">
          Организатор: {{ event.organizer?.name || 'Неизвестно' }}
        </span>
      </div>
      
      <button 
        @click="$emit('view-details', event.id)" 
        class="btn btn-primary text-sm py-2 px-3"
      >
        Подробнее
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '../types/index';

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
  return eventDate.toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
