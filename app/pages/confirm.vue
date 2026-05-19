<script setup lang="ts">
definePageMeta({ middleware: [] })

const supabase = useSupabaseClient()
const { joinFamily } = useProfile()
const route = useRoute()

const error = ref('')

async function handleInvite(invite: string) {
  try {
    console.log('[confirm] joining family with invite code:', invite)
    await joinFamily(invite)
    console.log('[confirm] joinFamily succeeded')
  } catch (e: any) {
    console.warn('[confirm] joinFamily failed (non-fatal):', e?.message)
  }
}

onMounted(async () => {
  const code = route.query.code as string | undefined
  const invite = route.query.invite as string | undefined

  console.log('[confirm] mounted — code present:', !!code, '| invite present:', !!invite)
  console.log('[confirm] full URL:', window.location.href)

  if (!code) {
    console.log('[confirm] no code in URL, redirecting to /login')
    await navigateTo('/login')
    return
  }

  // Check if the Supabase client already auto-exchanged the code before onMounted fired
  const { data: { session: existing }, error: sessionErr } = await supabase.auth.getSession()
  console.log('[confirm] existing session check — session:', !!existing, '| user:', existing?.user?.id, '| err:', sessionErr?.message)

  if (existing) {
    console.log('[confirm] session already exists, skipping exchange')
    if (invite) await handleInvite(invite)
    await navigateTo('/')
    return
  }

  console.log('[confirm] calling exchangeCodeForSession...')
  const { data: exchangeData, error: exchangeErr } = await supabase.auth.exchangeCodeForSession(code)
  console.log('[confirm] exchangeCodeForSession result — session:', !!exchangeData?.session, '| user:', exchangeData?.session?.user?.id, '| error:', exchangeErr?.message, '| error code:', (exchangeErr as any)?.code)

  if (exchangeErr) {
    // Race condition: the client may have auto-exchanged concurrently — check one more time
    console.log('[confirm] exchange error, checking for race session...')
    const { data: { session: raceSession }, error: raceErr } = await supabase.auth.getSession()
    console.log('[confirm] race session check — session:', !!raceSession, '| err:', raceErr?.message)

    if (raceSession) {
      console.log('[confirm] race session found, proceeding')
      if (invite) await handleInvite(invite)
      await navigateTo('/')
    } else {
      console.error('[confirm] no session after exchange failure — showing error')
      error.value = exchangeErr.message
    }
  } else {
    console.log('[confirm] exchange succeeded')
    if (invite) await handleInvite(invite)
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
