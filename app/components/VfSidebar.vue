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
  <aside class="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-60 bg-vf-card border-r border-vf-border z-40">
    <div class="px-5 py-5 border-b border-vf-border">
      <div class="text-[22px] font-extrabold text-primary tracking-tight">Vollfood</div>
      <div class="text-xs text-vf-muted mt-0.5">Your family cookbook</div>
    </div>

    <nav class="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.id"
        :to="tab.to"
        :class="isActive(tab) ? 'bg-primary-bg text-primary' : 'text-vf-mid hover:bg-vf-surface'"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold no-underline transition-colors"
      >
        <svg v-if="tab.id === 'home'" width="18" height="18" viewBox="0 0 22 22" fill="none">
          <path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H14v-5H8v5H4a1 1 0 01-1-1V9.5z"
            :stroke="isActive(tab) ? '#C8622A' : 'currentColor'" stroke-width="1.8"
            :fill="isActive(tab) ? 'rgba(200,98,42,0.13)' : 'none'" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="tab.id === 'all'" width="18" height="18" viewBox="0 0 22 22" fill="none">
          <rect x="3" y="4" width="16" height="2" rx="1" :fill="isActive(tab) ? '#C8622A' : 'currentColor'" />
          <rect x="3" y="10" width="16" height="2" rx="1" :fill="isActive(tab) ? '#C8622A' : 'currentColor'" />
          <rect x="3" y="16" width="10" height="2" rx="1" :fill="isActive(tab) ? '#C8622A' : 'currentColor'" />
        </svg>
        <svg v-else-if="tab.id === 'family'" width="18" height="18" viewBox="0 0 22 22" fill="none">
          <circle cx="8" cy="8" r="3.5" :stroke="isActive(tab) ? '#C8622A' : 'currentColor'" stroke-width="1.8" />
          <path d="M1.5 19c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" :stroke="isActive(tab) ? '#C8622A' : 'currentColor'" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="16" cy="7" r="2.5" :stroke="isActive(tab) ? '#C8622A' : 'currentColor'" stroke-width="1.5" />
          <path d="M20 17.5c0-2.5-1.8-4.5-4-4.5" :stroke="isActive(tab) ? '#C8622A' : 'currentColor'" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <svg v-else-if="tab.id === 'settings'" width="18" height="18" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="3" :stroke="isActive(tab) ? '#C8622A' : 'currentColor'" stroke-width="1.8" />
          <path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M4.22 17.78l1.42-1.42M16.36 5.64l1.42-1.42"
            :stroke="isActive(tab) ? '#C8622A' : 'currentColor'" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        {{ tab.label }}
      </NuxtLink>
    </nav>

    <div class="px-4 pb-5 pt-2 border-t border-vf-border">
      <NuxtLink
        to="/recipes/new"
        class="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-white text-[14px] font-bold no-underline hover:bg-primary-dark transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
        Add Recipe
      </NuxtLink>
    </div>
  </aside>
</template>
