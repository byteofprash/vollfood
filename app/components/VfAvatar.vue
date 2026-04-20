<script setup lang="ts">
const props = defineProps<{
  name: string
  initials: string
  hue: string
  size?: number
}>()
const sz = computed(() => props.size ?? 36)
</script>

<template>
  <div
    :style="{
      width: `${sz}px`,
      height: `${sz}px`,
      background: hue,
      fontSize: `${Math.round(sz * 0.38)}px`,
    }"
    class="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
  >
    {{ initials }}
  </div>
</template>
