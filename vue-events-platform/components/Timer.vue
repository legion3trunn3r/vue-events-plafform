<template>
  <div class="timer text-center">
    <div class="flex justify-center space-x-4">
      <div class="timer-unit">
        <div class="timer-number">{{ days }}</div>
        <div class="timer-label">дней</div>
      </div>
      <div class="timer-separator">:</div>
      <div class="timer-unit">
        <div class="timer-number">{{ hours }}</div>
        <div class="timer-label">часов</div>
      </div>
      <div class="timer-separator">:</div>
      <div class="timer-unit">
        <div class="timer-number">{{ minutes }}</div>
        <div class="timer-label">минут</div>
      </div>
      <div class="timer-separator">:</div>
      <div class="timer-unit">
        <div class="timer-number">{{ seconds }}</div>
        <div class="timer-label">секунд</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  targetDate: Date | string;
}

const props = defineProps<Props>();

const targetTime = computed(() => {
  return new Date(props.targetDate).getTime();
});

const timeRemaining = ref(0);
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

let intervalId: NodeJS.Timeout | null = null;

const updateTimer = () => {
  const now = new Date().getTime();
  const difference = targetTime.value - now;

  if (difference > 0) {
    timeRemaining.value = difference;
    
    days.value = Math.floor(difference / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes.value = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((difference % (1000 * 60)) / 1000);
  } else {
    // Event has started or passed
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
    
    if (intervalId) {
      clearInterval(intervalId);
    }
  }
};

onMounted(() => {
  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.timer-number {
  @apply text-2xl font-bold text-blue-600;
}

.timer-label {
  @apply text-xs text-gray-500 uppercase tracking-wide;
}

.timer-separator {
  @apply text-lg font-bold text-gray-400;
}

.timer-unit {
  @apply flex flex-col items-center;
}
</style>
