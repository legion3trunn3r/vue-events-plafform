<template>
  <div class="timer text-center">
    <div class="flex justify-center items-center space-x-3">
      <div class="timer-unit">
        <div class="timer-number">{{ String(days).padStart(2, '0') }}</div>
        <div class="timer-label">Days</div>
      </div>
      <div class="timer-separator">•</div>
      <div class="timer-unit">
        <div class="timer-number">{{ String(hours).padStart(2, '0') }}</div>
        <div class="timer-label">Hours</div>
      </div>
      <div class="timer-separator">•</div>
      <div class="timer-unit">
        <div class="timer-number">{{ String(minutes).padStart(2, '0') }}</div>
        <div class="timer-label">Minutes</div>
      </div>
      <div class="timer-separator">•</div>
      <div class="timer-unit">
        <div class="timer-number">{{ String(seconds).padStart(2, '0') }}</div>
        <div class="timer-label">Seconds</div>
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
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.timer-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 0.25rem;
}

.timer-separator {
  font-weight: 700;
  color: #64748b;
}

.timer-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
