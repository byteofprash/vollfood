<script setup lang="ts">
const props = defineProps<{ role: 'admin' | 'editor' | 'contributor' }>()
const labels = { admin: 'Admin', editor: 'Editor', contributor: 'Contributor' }
const colors = { admin: '#C8622A', editor: '#4E7C5E', contributor: '#6B7CB8' }
</script>

<template>
  <span
    :style="{
      color: colors[role],
      background: colors[role] + '22',
    }"
    class="text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded-full"
  >
    {{ labels[role] }}
  </span>
</template>
