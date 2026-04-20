<script setup lang="ts">
defineProps<{
  title: string
  onBack?: () => void
}>()
</script>

<template>
  <div class="flex items-center px-4 py-3 border-b border-vf-border bg-vf-bg gap-3 min-h-[52px]">
    <button
      v-if="onBack"
      class="p-1 pr-2 text-primary flex items-center"
      @click="onBack"
    >
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
        <path d="M7 1L1 7l6 6" :stroke="'#C8622A'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="flex-1 font-bold text-[17px] text-vf-text">{{ title }}</div>
    <slot name="right" />
  </div>
</template>
