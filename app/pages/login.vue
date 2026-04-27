<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const supabase = useSupabaseClient()
const { joinFamily } = useProfile()

const email = ref('')
const password = ref('')
const inviteCode = ref('')
const error = ref('')
const loading = ref(false)
const googleLoading = ref(false)
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

async function loginWithGoogle() {
  error.value = ''
  googleLoading.value = true
  try {
    const { error: e } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/confirm`,
      },
    })
    if (e) throw e
  } catch (e: any) {
    error.value = e.message ?? 'Google sign-in failed.'
    googleLoading.value = false
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

      <!-- Google button -->
      <button
        :disabled="googleLoading"
        class="mx-5 py-3.5 bg-vf-card border border-vf-border rounded-2xl text-[15px] font-semibold text-vf-text flex items-center justify-center gap-3 w-[calc(100%-40px)] disabled:opacity-60 transition-opacity hover:bg-vf-surface"
        @click="loginWithGoogle"
      >
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
          <path d="M43.611 20.083H42V20H24v8h11.303C33.94 32.657 29.396 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
          <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
          <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.376 0-9.908-3.32-11.31-7.934l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
          <path d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.591 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
        </svg>
        {{ googleLoading ? 'Redirecting…' : 'Continue with Google' }}
      </button>

      <!-- Divider -->
      <div class="flex items-center gap-3 mx-5 my-5">
        <div class="flex-1 h-px bg-vf-border" />
        <span class="text-xs text-vf-muted font-medium">or</span>
        <div class="flex-1 h-px bg-vf-border" />
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
        class="mx-5 mt-4 py-4 bg-primary text-white rounded-2xl text-base font-bold tracking-wide disabled:opacity-60 transition-opacity w-[calc(100%-40px)]"
        @click="submit"
      >
        {{ loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create Account' }}
      </button>

      <button
        class="mt-3 text-sm text-vf-muted text-center w-full"
        @click="mode = mode === 'login' ? 'signup' : 'login'; error = ''"
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
    </div>
  </div>
</template>
