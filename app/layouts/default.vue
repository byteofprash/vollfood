<script setup lang="ts">
const user = useSupabaseUser()
</script>

<template>
  <div class="min-h-screen bg-vf-bg font-sans">
    <VfSidebar v-if="user" />
    <div :class="user ? 'lg:pl-60' : ''">
      <slot />
    </div>
  </div>
</template>
