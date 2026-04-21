<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const supabase = useSupabaseClient()

const { data: members } = await useAsyncData('family-members', async () => {
  const { data } = await supabase
    .from('profiles')
    .select('id, name, hue, role')
    .order('name')
  return data ?? []
})

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="flex-1 overflow-y-auto bg-vf-bg pb-20 lg:pb-8">
      <div class="lg:max-w-4xl lg:mx-auto lg:px-8">
      <div class="px-4 lg:px-0 pt-5 pb-3">
        <div class="text-[22px] font-bold text-vf-text">Family</div>
        <div class="text-[13px] text-vf-muted mt-0.5">{{ members?.length ?? 0 }} members</div>
      </div>

      <div class="border-t border-b border-vf-border lg:border-none lg:grid lg:grid-cols-2 lg:gap-3 lg:border-0">
        <NuxtLink
          v-for="(m, i) in members"
          :key="m.id"
          :to="`/family/${m.id}`"
          :class="i < (members?.length ?? 0) - 1 ? 'border-b border-vf-border lg:border-b-0' : ''"
          class="flex items-center gap-3 px-4 py-3.5 bg-vf-card no-underline transition-colors hover:bg-vf-surface lg:rounded-2xl lg:border lg:border-vf-border"
        >
          <VfAvatar
            :name="m.name ?? ''"
            :initials="initials(m.name)"
            :hue="m.hue"
            :size="44"
          />
          <div class="flex-1">
            <div class="font-semibold text-[15px] text-vf-text">{{ m.name }}</div>
          </div>
          <VfRoleBadge :role="m.role" />
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path d="M1 1l5 5-5 5" stroke="#B8967A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NuxtLink>
      </div>
      </div><!-- /max-width wrapper -->
    </div>
    <VfTabBar />
  </div>
</template>
