<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const supabase = useSupabaseClient()
const { joinFamily } = useProfile()

const email = ref('')
const password = ref('')
const inviteCode = ref('')
const error = ref('')
const loading = ref(false)
const mode = ref<'login' | 'signup'>('login')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      const { error: e } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (e) throw e
    } else {
      const { error: e } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (e) throw e
      if (inviteCode.value) {
        await joinFamily(inviteCode.value)
      }
    }
    await navigateTo('/')
  } catch (e: any) {
    error.value = e.message ?? 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-vf-bg flex flex-col overflow-y-auto pb-10 lg:justify-center lg:items-center">
    <div class="w-full lg:max-w-sm lg:w-full">
    <!-- Header -->
    <div class="px-7 pt-14 pb-8 text-center">
      <div class="text-4xl font-extrabold text-primary tracking-tight">Vollfood</div>
      <div class="text-sm text-vf-muted mt-1.5">Your family's kitchen, forever.</div>
    </div>

    <!-- Email + Password -->
    <div class="mx-5 bg-vf-card rounded-2xl border border-vf-border overflow-hidden">
      <div class="px-4 py-3.5 border-b border-vf-border">
        <div class="text-[11px] font-semibold text-vf-muted uppercase tracking-wide mb-1">Email</div>
        <input
          v-model="email"
          type="email"
          placeholder="you@family.com"
          class="w-full bg-transparent text-base text-vf-text outline-none"
          @input="error = ''"
        />
      </div>
      <div class="px-4 py-3.5">
        <div class="text-[11px] font-semibold text-vf-muted uppercase tracking-wide mb-1">Password</div>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full bg-transparent text-base text-vf-text outline-none"
          @input="error = ''"
        />
      </div>
    </div>

    <p v-if="error" class="text-red-500 text-[13px] text-center mx-6 mt-2.5">{{ error }}</p>

    <button
      :disabled="loading"
      class="mx-5 mt-5 py-4 bg-primary text-white rounded-2xl text-base font-bold tracking-wide disabled:opacity-60 transition-opacity"
      @click="submit"
    >
      {{ mode === 'login' ? 'Enter the Kitchen' : 'Create Account' }}
    </button>

    <button
      class="mt-3 text-sm text-vf-muted text-center"
      @click="mode = mode === 'login' ? 'signup' : 'login'"
    >
      {{ mode === 'login' ? 'No account? Sign up' : 'Already have an account? Sign in' }}
    </button>

    <!-- Invite code (signup only) -->
    <template v-if="mode === 'signup'">
      <div class="mx-5 mt-7 bg-vf-card rounded-2xl border border-vf-border px-4 py-3.5">
        <div class="text-[11px] font-semibold text-vf-muted uppercase tracking-wide mb-1">Family Invite Code</div>
        <input
          v-model="inviteCode"
          placeholder="Enter code to join a family"
          class="w-full bg-transparent text-base text-vf-text outline-none"
        />
      </div>
      <p class="text-xs text-vf-muted text-center mt-3">Ask your family admin for an invite code</p>
    </template>
    </div><!-- /max-width wrapper -->
  </div>
</template>
