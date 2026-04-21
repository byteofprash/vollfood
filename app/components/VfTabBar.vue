<script setup lang="ts">
const route = useRoute()

const tabs = [
  { id: 'home', label: 'Home', to: '/' },
  { id: 'all', label: 'All Recipes', to: '/recipes' },
  { id: 'family', label: 'Family', to: '/family' },
  { id: 'settings', label: 'Settings', to: '/settings' },
]

function isActive(tab: typeof tabs[0]) {
  if (tab.to === '/') return route.path === '/'
  return route.path.startsWith(tab.to)
}
</script>

<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-vf-tab border-t border-vf-border flex items-center backdrop-blur-md z-50 pb-2">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.id"
      :to="tab.to"
      class="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 no-underline"
    >
      <!-- Home icon -->
      <svg v-if="tab.id === 'home'" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H14v-5H8v5H4a1 1 0 01-1-1V9.5z"
          :stroke="isActive(tab) ? '#C8622A' : '#B8967A'"
          stroke-width="1.8"
          :fill="isActive(tab) ? 'rgba(200,98,42,0.13)' : 'none'"
          stroke-linejoin="round"
        />
      </svg>
      <!-- All Recipes icon -->
      <svg v-else-if="tab.id === 'all'" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="4" width="16" height="2" rx="1" :fill="isActive(tab) ? '#C8622A' : '#B8967A'"/>
        <rect x="3" y="10" width="16" height="2" rx="1" :fill="isActive(tab) ? '#C8622A' : '#B8967A'"/>
        <rect x="3" y="16" width="10" height="2" rx="1" :fill="isActive(tab) ? '#C8622A' : '#B8967A'"/>
      </svg>
      <!-- Family icon -->
      <svg v-else-if="tab.id === 'family'" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="8" cy="8" r="3.5" :stroke="isActive(tab) ? '#C8622A' : '#B8967A'" stroke-width="1.8"/>
        <path d="M1.5 19c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" :stroke="isActive(tab) ? '#C8622A' : '#B8967A'" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="16" cy="7" r="2.5" :stroke="isActive(tab) ? '#C8622A' : '#B8967A'" stroke-width="1.5"/>
        <path d="M20 17.5c0-2.5-1.8-4.5-4-4.5" :stroke="isActive(tab) ? '#C8622A' : '#B8967A'" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <!-- Settings icon -->
      <svg v-else-if="tab.id === 'settings'" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" :stroke="isActive(tab) ? '#C8622A' : '#B8967A'" stroke-width="1.8"/>
        <path
          d="M11 2v2M11 18v2M2 11h2M18 11h2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M4.22 17.78l1.42-1.42M16.36 5.64l1.42-1.42"
          :stroke="isActive(tab) ? '#C8622A' : '#B8967A'"
          stroke-width="1.8"
          stroke-linecap="round"
        />
      </svg>
      <span
        class="text-[10px] font-semibold"
        :class="isActive(tab) ? 'text-primary' : 'text-vf-muted'"
      >
        {{ tab.label }}
      </span>
    </NuxtLink>
  </div>
</template>
