<script setup lang="ts">
const props = defineProps<{ id: string | number; size?: number }>()
const colors = ['#E8C4A0', '#D4A882', '#C49070', '#E0B898', '#D8BCA8']
const color = computed(() => colors[Number(props.id) % colors.length])
const sz = computed(() => props.size ?? 56)
</script>

<template>
  <div
    :style="{ width: `${sz}px`, height: `${sz}px`, background: color }"
    class="rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
  >
    <svg :width="sz * 0.45" :height="sz * 0.45" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C7 2 3 6 3 11c0 3.5 2 6.5 5 8v1a1 1 0 001 1h6a1 1 0 001-1v-1c3-1.5 5-4.5 5-8 0-5-4-9-9-9z" fill="rgba(255,255,255,0.6)"/>
    </svg>
  </div>
</template>
