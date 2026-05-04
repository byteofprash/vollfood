<script setup lang="ts">
definePageMeta({ middleware: [] })

const supabase = useSupabaseClient()
const route = useRoute()

const error = ref('')

onMounted(async () => {
  const code = route.query.code as string | undefined

  if (!code) {
    await navigateTo('/login')
    return
  }

  const { error: e } = await supabase.auth.exchangeCodeForSession(code)

  if (e) {
    error.value = e.message
  } else {
    await navigateTo('/')
  }
})
</script>

<template>
  <div class="min-h-screen bg-vf-bg flex flex-col items-center justify-center gap-4">
    <template v-if="!error">
      <div class="w-10 h-10 rounded-full border-[3px] border-primary-soft border-t-primary animate-spin" />
      <p class="text-sm text-vf-muted">Signing you in…</p>
    </template>
    <template v-else>
      <p class="text-red-500 text-sm text-center px-6">{{ error }}</p>
      <NuxtLink to="/login" class="text-sm text-primary font-semibold">Back to login</NuxtLink>
    </template>
  </div>
</template>
