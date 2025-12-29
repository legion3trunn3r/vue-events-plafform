<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900">
              🎉 Платформа Микро-Ивентов
            </h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <div v-if="userStore.isAuthenticated" class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">
                Привет, {{ userStore.userName }}!
              </span>
              <NuxtLink 
                to="/events/create" 
                class="btn btn-primary"
              >
                Создать Ивент
              </NuxtLink>
              <button 
                @click="userStore.logout" 
                class="btn btn-secondary"
              >
                Выйти
              </button>
            </div>
            <div v-else class="flex items-center space-x-4">
              <NuxtLink to="/login" class="btn btn-secondary">
                Войти
              </NuxtLink>
              <NuxtLink to="/register" class="btn btn-primary">
                Регистрация
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          Организуйте Незабываемые Микро-События
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          Создавайте социальные мероприятия, приглашайте гостей и отслеживайте регистрацию с помощью QR-кодов
        </p>
        <div v-if="!userStore.isAuthenticated" class="space-x-4">
          <NuxtLink to="/register" class="btn btn-primary">
            Начать Сейчас
          </NuxtLink>
          <NuxtLink to="/login" class="btn btn-secondary">
            Войти
          </NuxtLink>
        </div>
      </div>

      <!-- Events Grid -->
      <div class="mb-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6">
          {{ userStore.isAuthenticated ? 'Мои Ивенты' : 'Предстоящие Ивенты' }}
        </h3>
        
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        
        <div v-else-if="events.length === 0" class="text-center py-12">
          <div class="text-gray-500 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-gray-600">
            {{ userStore.isAuthenticated ? 'У вас пока нет ивентов' : 'Нет доступных ивентов' }}
          </p>
          <div v-if="userStore.isAuthenticated" class="mt-4">
            <NuxtLink to="/events/create" class="btn btn-primary">
              Создать Первый Ивент
            </NuxtLink>
          </div>
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EventCard 
            v-for="event in events" 
            :key="event.id" 
            :event="event"
            @view-details="viewEventDetails"
          />
        </div>
      </div>

      <!-- Features Section -->
      <div class="bg-white rounded-lg shadow-md p-8 mt-12">
        <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">
          Возможности Платформы
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span class="text-2xl">📅</span>
            </div>
            <h4 class="text-lg font-semibold mb-2">Создание Ивентов</h4>
            <p class="text-gray-600">
              Легко создавайте социальные мероприятия с подробным описанием и фотографиями
            </p>
          </div>
          
          <div class="text-center">
            <div class="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span class="text-2xl">📱</span>
            </div>
            <h4 class="text-lg font-semibold mb-2">QR-Коды</h4>
            <p class="text-gray-600">
              Генерируйте уникальные QR-коды для входа гостей на мероприятие
            </p>
          </div>
          
          <div class="text-center">
            <div class="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span class="text-2xl">⏰</span>
            </div>
            <h4 class="text-lg font-semibold mb-2">Таймер Обратного Отсчёта</h4>
            <p class="text-gray-600">
              Отображайте обратный отсчёт до начала ивента в реальном времени
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../components/stores/user';
import type { Event } from '../types/index';

const userStore = useUserStore();
const events = ref<Event[]>([]);
const isLoading = ref(true);

// Инициализация пользователя при загрузке страницы
onMounted(async () => {
  await userStore.initializeFromToken();
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

// SEO Meta
useHead({
  title: 'Платформа Микро-Ивентов - Организуйте Незабываемые События',
  meta: [
    { name: 'description', content: 'Создавайте социальные мероприятия, приглашайте гостей и отслеживайте регистрацию с помощью QR-кодов' },
    { name: 'keywords', content: 'ивент, мероприятие, социальные события, QR-код, регистрация' }
  ]
});
</script>
