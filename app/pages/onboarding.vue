<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const { profile, fetch: fetchProfile } = useProfile()
await fetchProfile()

const router = useRouter()

const onboardedCookie = useCookie(`vf_ob_${profile.value?.family_id ?? 'x'}`, {
  maxAge: 60 * 60 * 24 * 365 * 5,
  sameSite: 'lax',
})

const seeding = ref(false)
const error = ref('')

const samples = [
  { icon: '☕', name: 'Masala Chai' },
  { icon: '🥞', name: 'Fluffy Pancakes' },
  { icon: '🍛', name: 'Dal Tadka' },
  { icon: '🌿', name: 'Palak Paneer' },
  { icon: '🍝', name: 'Spaghetti Bolognese' },
  { icon: '🥟', name: 'Samosa' },
  { icon: '🍪', name: 'Chocolate Chip Cookies' },
  { icon: '🫓', name: 'Upma' },
]

async function seedAndGo() {
  seeding.value = true
  error.value = ''
  try {
    await $fetch('/api/onboarding/seed', { method: 'POST' })
    onboardedCookie.value = '1'
    await router.push('/')
  } catch (e: any) {
    error.value = e.data?.message ?? e.message ?? 'Something went wrong.'
    seeding.value = false
  }
}

function skipAndGo() {
  onboardedCookie.value = '1'
  router.push('/')
}

const firstName = computed(() => profile.value?.name?.split(' ')[0] ?? 'Chef')
</script>

<template>
  <div class="min-h-screen bg-vf-bg flex flex-col items-center justify-center px-5 py-12">
    <div class="w-full max-w-sm">

      <!-- Logo mark -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_8px_24px_rgba(200,98,42,0.3)] mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 2 5 5 5 9c0 2.5 1.2 4.7 3 6.1V18h8v-2.9c1.8-1.4 3-3.6 3-6.1 0-4-3-7-7-7z" fill="white" opacity="0.9"/>
            <rect x="9" y="18" width="6" height="2" rx="1" fill="white" opacity="0.7"/>
            <rect x="10" y="20" width="4" height="1.5" rx="0.75" fill="white" opacity="0.5"/>
          </svg>
        </div>
        <h1 class="text-3xl font-extrabold text-primary tracking-tight">Vollfood</h1>
        <p class="text-sm text-vf-muted mt-1">Your family's kitchen, forever.</p>
      </div>

      <!-- Welcome -->
      <div class="text-center mb-6">
        <p class="text-[22px] font-bold text-vf-text">Welcome, {{ firstName }}! 👋</p>
        <p class="text-sm text-vf-muted mt-1.5 leading-relaxed">Would you like to start with some sample recipes to explore the app?</p>
      </div>

      <!-- Option 1: Sample recipes -->
      <div class="bg-vf-card border border-vf-border rounded-3xl overflow-hidden mb-3 shadow-sm">
        <div class="px-5 pt-5 pb-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">🍽</span>
            <span class="text-[15px] font-bold text-vf-text">Start with sample recipes</span>
          </div>
          <p class="text-xs text-vf-muted leading-relaxed mb-4">
            8 recipes across 4 categories — a mix of classic South Asian and universal dishes. Edit, fork, or delete them any time.
          </p>

          <!-- Recipe preview grid -->
          <div class="grid grid-cols-4 gap-1.5 mb-5">
            <div
              v-for="s in samples"
              :key="s.name"
              class="bg-vf-surface rounded-xl px-1.5 py-2 flex flex-col items-center gap-1"
            >
              <span class="text-lg">{{ s.icon }}</span>
              <span class="text-[9px] text-vf-muted text-center leading-tight font-medium">{{ s.name }}</span>
            </div>
          </div>

          <button
            :disabled="seeding"
            class="w-full py-3.5 rounded-2xl bg-primary text-white text-[15px] font-bold border-none disabled:opacity-60 transition-opacity shadow-[0_4px_16px_rgba(200,98,42,0.3)]"
            @click="seedAndGo"
          >
            <span v-if="seeding" class="flex items-center justify-center gap-2">
              <span class="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block" />
              Adding recipes…
            </span>
            <span v-else>Populate with samples</span>
          </button>
        </div>
      </div>

      <!-- Option 2: Start fresh -->
      <div class="bg-vf-card border border-vf-border rounded-3xl overflow-hidden shadow-sm">
        <div class="px-5 py-5">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">✨</span>
            <span class="text-[15px] font-bold text-vf-text">Start fresh</span>
          </div>
          <p class="text-xs text-vf-muted leading-relaxed mb-4">
            Blank slate — add your family's real recipes from the beginning.
          </p>
          <button
            class="w-full py-3.5 rounded-2xl border-[1.5px] border-vf-border bg-vf-surface text-vf-mid text-[15px] font-semibold"
            @click="skipAndGo"
          >
            Skip, start empty
          </button>
        </div>
      </div>

      <p v-if="error" class="text-red-500 text-sm text-center mt-4">{{ error }}</p>
    </div>
  </div>
</template>
