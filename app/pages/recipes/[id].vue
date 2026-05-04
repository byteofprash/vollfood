<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { profile, fetch: fetchProfile } = useProfile()

await fetchProfile()

const { data: recipe, refresh: refreshRecipe } = await useAsyncData(`recipe-${route.params.id}`, async () => {
  const { data } = await supabase
    .from('recipes')
    .select(`
      id, name, cooktime, serves,
      category:categories(id, name),
      recipe_versions(
        id, note, ingredients, steps, is_original,
        author:profiles(id, name, hue)
      )
    `)
    .eq('id', route.params.id)
    .single()
  return data
})

const forkIndex = ref(0)
const activeTab = ref<'ingredients' | 'steps'>('ingredients')
const comparing = ref(false)

const versions = computed(() => (recipe.value?.recipe_versions ?? []) as any[])
const fork = computed(() => versions.value[forkIndex.value])

// ── Mode system ──────────────────────────────────────────────────────────────
type Mode = 'view' | 'edit' | 'fork'
type ForkStage = 'idle' | 'recording' | 'processing' | 'review'

const mode = ref<Mode>('view')
const showSheet = ref(false)

const myVersion = computed(() => versions.value.find((v: any) => v.author?.id === user.value?.id))
const canEditFork = computed(() => {
  if (!user.value || !fork.value) return false
  if (fork.value.author?.id === user.value.id) return true
  return profile.value?.role === 'admin' || profile.value?.role === 'editor'
})
const canAddVersion = computed(() => !!user.value && !myVersion.value)

// ── Edit mode ────────────────────────────────────────────────────────────────
const editForm = reactive({
  name: '',
  cooktime: null as number | null,
  serves: null as number | null,
  note: '',
  ingredients: [] as string[],
  steps: [] as string[],
})
const editSaving = ref(false)
const editError = ref('')

function startEdit() {
  if (!fork.value || !recipe.value) return
  editForm.name = recipe.value.name
  editForm.cooktime = recipe.value.cooktime ?? null
  editForm.serves = recipe.value.serves ?? null
  editForm.note = fork.value.note ?? ''
  editForm.ingredients = [...(fork.value.ingredients ?? [])]
  editForm.steps = [...(fork.value.steps ?? [])]
  showSheet.value = false
  mode.value = 'edit'
}

async function saveEdit() {
  editSaving.value = true
  editError.value = ''
  try {
    const { error: rErr } = await supabase.from('recipes').update({
      name: editForm.name,
      cooktime: Number.isFinite(editForm.cooktime) ? editForm.cooktime : null,
      serves: Number.isFinite(editForm.serves) ? editForm.serves : null,
    }).eq('id', route.params.id as string)
    if (rErr) throw rErr

    const { error: vErr } = await supabase.from('recipe_versions').update({
      note: editForm.note || null,
      ingredients: editForm.ingredients,
      steps: editForm.steps,
    }).eq('id', fork.value.id)
    if (vErr) throw vErr

    await refreshRecipe()
    mode.value = 'view'
  } catch (e: any) {
    editError.value = e.message ?? 'Failed to save.'
  } finally {
    editSaving.value = false
  }
}

// ── Fork (add my version) mode ───────────────────────────────────────────────
const forkStage = ref<ForkStage>('idle')
const forkTranscript = ref('')
const forkError = ref('')
const forkShowTranscript = ref(false)
const forkNote = ref('')
const showBaseRecipe = ref(true)

interface ForkParsed { ingredients: string[]; steps: string[] }
const forkParsed = ref<ForkParsed | null>(null)

const languages = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'de-DE', label: 'German' },
  { code: 'fr-FR', label: 'French' },
  { code: 'es-ES', label: 'Spanish' },
]
const selectedLang = ref('en-US')

let recognition: any = null

function startFork() {
  forkTranscript.value = ''
  forkError.value = ''
  forkNote.value = ''
  forkParsed.value = null
  forkStage.value = 'idle'
  showSheet.value = false
  mode.value = 'fork'
}

function startForkRecording() {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) {
    forkError.value = 'Speech recognition not supported in this browser. Try Chrome.'
    return
  }
  forkTranscript.value = ''
  forkError.value = ''
  recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = selectedLang.value
  recognition.onresult = (e: any) => {
    forkTranscript.value = Array.from(e.results).map((r: any) => r[0].transcript).join(' ')
  }
  recognition.onerror = (e: any) => {
    forkError.value = `Mic error: ${e.error}`
    forkStage.value = 'idle'
  }
  recognition.start()
  forkStage.value = 'recording'
}

async function parseForkTranscript() {
  forkStage.value = 'processing'
  try {
    const res = await $fetch('/api/recipes/fork', {
      method: 'POST',
      body: {
        baseIngredients: fork.value?.ingredients ?? [],
        baseSteps: fork.value?.steps ?? [],
        deltaTranscript: forkTranscript.value,
      },
    })
    forkParsed.value = res as ForkParsed
    forkStage.value = 'review'
    forkShowTranscript.value = false
  } catch (e: any) {
    forkError.value = e.message ?? 'Failed to apply changes.'
    forkStage.value = 'idle'
  }
}

async function stopAndParseFork() {
  recognition?.stop()
  await parseForkTranscript()
}

const forkSaving = ref(false)

async function saveFork() {
  if (!forkParsed.value || !user.value) return
  forkSaving.value = true
  forkError.value = ''
  try {
    const { error: vErr } = await supabase.from('recipe_versions').insert({
      recipe_id: route.params.id,
      author_id: user.value.id,
      note: forkNote.value || null,
      ingredients: forkParsed.value.ingredients,
      steps: forkParsed.value.steps,
      is_original: false,
    })
    if (vErr) throw vErr

    await refreshRecipe()
    const newIdx = versions.value.findIndex((v: any) => v.author?.id === user.value?.id)
    if (newIdx >= 0) forkIndex.value = newIdx
    mode.value = 'view'
  } catch (e: any) {
    forkError.value = e.message ?? 'Failed to save version.'
  } finally {
    forkSaving.value = false
  }
}

function exitMode() {
  recognition?.stop()
  mode.value = 'view'
  showSheet.value = false
}

function initials(name: string) {
  return name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
}

function cookLabel(min: number | null) {
  if (!min) return null
  if (min < 60) return `${min} min`
  return `${Math.floor(min / 60)}h ${min % 60 ? min % 60 + 'm' : ''}`
}

onUnmounted(() => recognition?.stop())
</script>

<template>
  <div class="h-screen flex flex-col bg-vf-bg">

    <!-- Header: View -->
    <VfHeader v-if="mode === 'view'" :title="recipe?.name ?? ''" :on-back="() => useRouter().back()">
      <template #right>
        <button
          v-if="versions.length > 1"
          :class="comparing ? 'bg-primary text-white' : 'bg-primary-bg text-primary'"
          class="rounded-full px-3.5 py-1.5 text-[13px] font-semibold border-none"
          @click="comparing = !comparing"
        >
          {{ comparing ? 'Single' : 'Compare' }}
        </button>
      </template>
    </VfHeader>

    <!-- Header: Edit -->
    <VfHeader v-else-if="mode === 'edit'" title="Edit Recipe" :on-back="exitMode">
      <template #right>
        <button
          :disabled="editSaving"
          class="text-primary text-[15px] font-bold disabled:opacity-50"
          @click="saveEdit"
        >
          {{ editSaving ? 'Saving…' : 'Save' }}
        </button>
      </template>
    </VfHeader>

    <!-- Header: Fork -->
    <VfHeader v-else title="Add My Version" :on-back="exitMode" />

    <!-- ════════════════════════ VIEW MODE ════════════════════════ -->
    <div v-if="mode === 'view'" class="flex-1 overflow-y-auto pb-6 lg:pb-8">
      <div class="lg:max-w-3xl lg:mx-auto">
        <!-- Hero -->
        <div class="h-40 bg-gradient-to-br from-primary-soft to-primary/20 flex items-center justify-center relative flex-shrink-0">
          <VfRecipePlaceholder :id="recipe?.id ?? 0" :size="64" />
          <div class="absolute bottom-3 left-4 flex gap-2">
            <span
              v-for="pill in [[cookLabel(recipe?.cooktime), '⏱'], [recipe?.serves ? `${recipe.serves} serves` : null, '🍽']]"
              :key="pill[1]"
            >
              <span
                v-if="pill[0]"
                class="bg-white/85 rounded-full px-2.5 py-1 text-xs font-semibold text-vf-text flex items-center gap-1"
              >
                {{ pill[1] }} {{ pill[0] }}
              </span>
            </span>
          </div>
        </div>

        <!-- Single view -->
        <template v-if="!comparing">
          <!-- Fork selector -->
          <div v-if="versions.length > 1" class="flex gap-2 px-4 py-3 overflow-x-auto border-b border-vf-border">
            <button
              v-for="(v, i) in versions"
              :key="v.id"
              :class="i === forkIndex ? 'border-primary bg-primary-bg' : 'border-vf-border bg-vf-card'"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-[1.5px] flex-shrink-0"
              @click="forkIndex = i; activeTab = 'ingredients'"
            >
              <VfAvatar
                v-if="v.author"
                :name="v.author.name"
                :initials="initials(v.author.name)"
                :hue="v.author.hue"
                :size="22"
              />
              <span
                :class="i === forkIndex ? 'text-primary font-bold' : 'text-vf-mid font-medium'"
                class="text-[13px] whitespace-nowrap"
              >
                {{ v.author?.name.split(' ')[0] ?? 'Unknown' }}
              </span>
            </button>
          </div>

          <!-- Author note -->
          <div v-if="fork?.note" class="mx-4 mt-3 px-3.5 py-3 bg-primary-bg rounded-xl border-l-[3px] border-primary">
            <div class="flex items-center gap-2 mb-1.5">
              <VfAvatar
                v-if="fork.author"
                :name="fork.author.name"
                :initials="initials(fork.author.name)"
                :hue="fork.author.hue"
                :size="24"
              />
              <span class="text-[13px] font-bold text-vf-text">{{ fork.author?.name }}</span>
              <VfRoleBadge v-if="fork.author" role="editor" />
            </div>
            <p class="text-[13px] text-vf-mid leading-relaxed">{{ fork.note }}</p>
          </div>

          <!-- Tabs -->
          <div class="flex border-b border-vf-border bg-vf-card mt-3">
            <button
              v-for="tab in ['ingredients', 'steps'] as const"
              :key="tab"
              :class="activeTab === tab ? 'text-primary font-bold border-b-2 border-primary' : 'text-vf-muted font-medium border-b-2 border-transparent'"
              class="flex-1 py-3 text-sm capitalize"
              @click="activeTab = tab"
            >
              {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
            </button>
          </div>

          <!-- Ingredients -->
          <div v-if="activeTab === 'ingredients'">
            <div
              v-for="(ing, i) in (fork?.ingredients ?? [])"
              :key="i"
              class="flex items-center gap-2.5 px-4 py-[11px] border-b border-vf-border"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span class="text-sm text-vf-text">{{ ing }}</span>
            </div>
          </div>

          <!-- Steps -->
          <div v-if="activeTab === 'steps'">
            <div
              v-for="(step, i) in (fork?.steps ?? [])"
              :key="i"
              class="flex gap-3 items-start px-4 py-3 border-b border-vf-border"
            >
              <div class="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {{ i + 1 }}
              </div>
              <span class="text-sm text-vf-text leading-[1.55] pt-0.5">{{ step }}</span>
            </div>
          </div>
        </template>

        <!-- Compare view -->
        <template v-else>
          <div class="flex border-b border-vf-border bg-vf-card">
            <button
              v-for="tab in ['ingredients', 'steps'] as const"
              :key="tab"
              :class="activeTab === tab ? 'text-primary font-bold border-b-2 border-primary' : 'text-vf-muted font-medium border-b-2 border-transparent'"
              class="flex-1 py-3 text-sm capitalize"
              @click="activeTab = tab"
            >
              {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
            </button>
          </div>

          <div class="grid grid-cols-2 border-b border-vf-border">
            <div
              v-for="(v, i) in versions.slice(0, 2)"
              :key="v.id"
              :class="i === 0 ? 'bg-primary-bg border-r border-vf-border' : 'bg-[#F0F7F0]'"
              class="px-3 py-2.5 flex items-center gap-1.5"
            >
              <VfAvatar
                v-if="v.author"
                :name="v.author.name"
                :initials="initials(v.author.name)"
                :hue="v.author.hue"
                :size="24"
              />
              <div>
                <div class="text-xs font-bold text-vf-text">{{ v.author?.name.split(' ')[0] }}</div>
                <div class="text-[10px] text-vf-muted">v{{ i + 1 }}</div>
              </div>
            </div>
          </div>

          <template v-if="activeTab === 'ingredients'">
            <div
              v-for="(_, i) in Array.from({ length: Math.max(...versions.slice(0, 2).map(v => v.ingredients?.length ?? 0)) })"
              :key="i"
              class="grid grid-cols-2 border-b border-vf-border"
            >
              <div
                v-for="(v, fi) in versions.slice(0, 2)"
                :key="fi"
                :class="[fi === 0 ? 'border-r border-vf-border bg-white' : 'bg-[#F8FBF8]', !v.ingredients?.[i] && 'opacity-30']"
                class="px-3 py-2.5 text-xs text-vf-text leading-snug"
              >
                {{ v.ingredients?.[i] ?? '—' }}
              </div>
            </div>
          </template>
          <template v-else>
            <div
              v-for="(_, i) in Array.from({ length: Math.max(...versions.slice(0, 2).map(v => v.steps?.length ?? 0)) })"
              :key="i"
              class="grid grid-cols-2 border-b border-vf-border"
            >
              <div
                v-for="(v, fi) in versions.slice(0, 2)"
                :key="fi"
                :class="fi === 0 ? 'border-r border-vf-border bg-white' : 'bg-[#F8FBF8]'"
                class="px-3 py-2.5"
              >
                <template v-if="v.steps?.[i]">
                  <div class="w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center mb-1.5">
                    {{ i + 1 }}
                  </div>
                  <p class="text-xs text-vf-text leading-snug">{{ v.steps[i] }}</p>
                </template>
                <span v-else class="text-xs text-vf-muted">—</span>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <!-- ════════════════════════ EDIT MODE ════════════════════════ -->
    <div v-else-if="mode === 'edit'" class="flex-1 overflow-y-auto pb-6 lg:max-w-3xl lg:mx-auto lg:w-full">
      <!-- Metadata -->
      <div class="border-t border-b border-vf-border">
        <div class="flex justify-between items-center px-4 py-3.5 border-b border-vf-border">
          <span class="text-xs font-semibold text-vf-muted uppercase tracking-wide shrink-0">Name</span>
          <input v-model="editForm.name" class="text-[15px] text-vf-text font-medium bg-transparent outline-none text-right flex-1 ml-4" placeholder="Recipe name" />
        </div>
        <div class="flex justify-between items-center px-4 py-3.5 border-b border-vf-border">
          <span class="text-xs font-semibold text-vf-muted uppercase tracking-wide shrink-0">Cook Time</span>
          <div class="flex items-center gap-1.5">
            <input v-model.number="editForm.cooktime" type="number" min="0" class="text-[15px] text-vf-text font-medium bg-transparent outline-none text-right w-16" placeholder="—" />
            <span class="text-sm text-vf-muted">min</span>
          </div>
        </div>
        <div class="flex justify-between items-center px-4 py-3.5 border-b border-vf-border">
          <span class="text-xs font-semibold text-vf-muted uppercase tracking-wide shrink-0">Serves</span>
          <input v-model.number="editForm.serves" type="number" min="1" class="text-[15px] text-vf-text font-medium bg-transparent outline-none text-right w-16" placeholder="—" />
        </div>
        <div class="flex items-start gap-3 px-4 py-3.5">
          <span class="text-xs font-semibold text-vf-muted uppercase tracking-wide shrink-0 pt-1">Note</span>
          <textarea v-model="editForm.note" rows="2" class="flex-1 text-[15px] text-vf-text font-medium bg-transparent outline-none resize-none text-right leading-relaxed" placeholder="Your personal note…" />
        </div>
      </div>

      <!-- Ingredients -->
      <VfSectionLabel>Ingredients</VfSectionLabel>
      <div class="border-t border-b border-vf-border">
        <div v-for="(_, i) in editForm.ingredients" :key="i" class="flex items-center gap-2.5 px-4 py-[11px] border-b border-vf-border">
          <div class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
          <input v-model="editForm.ingredients[i]" class="flex-1 text-sm text-vf-text bg-transparent outline-none" placeholder="Ingredient" />
          <button class="text-vf-muted text-xl leading-none pl-2 hover:text-red-400 transition-colors" @click="editForm.ingredients.splice(i, 1)">×</button>
        </div>
        <button class="w-full px-4 py-3 text-sm text-primary font-semibold text-left hover:bg-primary-bg transition-colors" @click="editForm.ingredients.push('')">+ Add ingredient</button>
      </div>

      <!-- Steps -->
      <VfSectionLabel>Steps</VfSectionLabel>
      <div class="border-t border-b border-vf-border">
        <div v-for="(_, i) in editForm.steps" :key="i" class="flex gap-3 items-start px-4 py-3 border-b border-vf-border">
          <div class="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">{{ i + 1 }}</div>
          <textarea v-model="editForm.steps[i]" rows="2" class="flex-1 text-sm text-vf-text leading-[1.55] bg-transparent outline-none resize-none pt-0.5" placeholder="Step description" />
          <button class="text-vf-muted text-xl leading-none mt-0.5 hover:text-red-400 transition-colors" @click="editForm.steps.splice(i, 1)">×</button>
        </div>
        <button class="w-full px-4 py-3 text-sm text-primary font-semibold text-left hover:bg-primary-bg transition-colors" @click="editForm.steps.push('')">+ Add step</button>
      </div>

      <p v-if="editError" class="text-red-500 text-sm text-center px-4 mt-3">{{ editError }}</p>
    </div>

    <!-- ════════════════════════ FORK MODE ════════════════════════ -->
    <template v-else>

      <!-- Fork: Idle -->
      <div v-if="forkStage === 'idle'" class="flex-1 flex flex-col px-5 pt-5 gap-4 overflow-y-auto pb-6">

        <!-- Base recipe reference (collapsible) -->
        <div class="bg-vf-card border border-vf-border rounded-2xl overflow-hidden">
          <button class="w-full flex justify-between items-center px-4 py-3.5" @click="showBaseRecipe = !showBaseRecipe">
            <div class="flex items-center gap-2">
              <VfAvatar
                v-if="fork?.author"
                :name="fork.author.name"
                :initials="initials(fork.author.name)"
                :hue="fork.author.hue"
                :size="20"
              />
              <span class="text-sm font-semibold text-vf-text">Based on {{ fork?.author?.name?.split(' ')[0] }}'s version</span>
            </div>
            <svg :class="showBaseRecipe ? 'rotate-180' : ''" class="transition-transform text-vf-muted" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div v-if="showBaseRecipe" class="border-t border-vf-border px-4 py-3 space-y-0.5">
            <p class="text-[11px] font-semibold text-vf-muted uppercase tracking-wide mb-2">Ingredients</p>
            <div v-for="(ing, i) in (fork?.ingredients ?? [])" :key="i" class="flex items-center gap-2 py-0.5">
              <div class="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
              <span class="text-xs text-vf-text">{{ ing }}</span>
            </div>
          </div>
        </div>

        <!-- Prompt text -->
        <div class="text-center">
          <p class="text-[20px] font-bold text-vf-text">What's different in yours?</p>
          <p class="text-sm text-vf-muted mt-2 leading-relaxed">Narrate only the changes — "instead of X use Y" or "add a pinch of Z"</p>
        </div>

        <!-- Language selector -->
        <div class="bg-vf-card border border-vf-border rounded-2xl px-4 py-3 flex items-center justify-between">
          <span class="text-sm text-vf-muted font-medium">Language</span>
          <select v-model="selectedLang" class="bg-transparent text-sm font-semibold text-vf-text outline-none cursor-pointer">
            <option v-for="lang in languages" :key="lang.code" :value="lang.code">{{ lang.label }}</option>
          </select>
        </div>

        <!-- Mic button -->
        <div class="flex flex-col items-center gap-3">
          <button
            class="w-[120px] h-[120px] rounded-full bg-primary flex items-center justify-center shadow-[0_8px_32px_rgba(200,98,42,0.33)] transition-transform hover:scale-105 active:scale-95 border-none"
            @click="startForkRecording"
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="11" rx="3" fill="white"/>
              <path d="M5 11a7 7 0 0014 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 18v3M9 21h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <p class="text-sm text-vf-muted">Tap to start speaking</p>
        </div>

        <p v-if="forkError" class="text-red-500 text-sm text-center">{{ forkError }}</p>
      </div>

      <!-- Fork: Recording -->
      <div v-else-if="forkStage === 'recording'" class="flex-1 flex flex-col items-center px-6 pt-8 gap-5">
        <div class="relative w-[100px] h-[100px] flex items-center justify-center">
          <div
            v-for="i in 3"
            :key="i"
            :style="{ width: `${100 + i * 28}px`, height: `${100 + i * 28}px`, opacity: 0.15 / i }"
            class="absolute rounded-full border-2 border-primary animate-ping"
          />
          <div class="w-[100px] h-[100px] rounded-full bg-primary flex items-center justify-center shadow-[0_6px_24px_rgba(200,98,42,0.27)]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="11" rx="3" fill="white"/>
              <path d="M5 11a7 7 0 0014 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
              <path d="M12 18v3M9 21h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <p class="text-primary text-[13px] font-semibold flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
          Listening… <span class="text-vf-muted font-normal">({{ languages.find(l => l.code === selectedLang)?.label }})</span>
        </p>

        <div class="w-full bg-vf-card rounded-2xl p-4 border border-vf-border min-h-[120px] flex-1">
          <p class="text-sm text-vf-text leading-relaxed">{{ forkTranscript }}<span class="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" /></p>
        </div>

        <button class="px-7 py-3 rounded-full border-[1.5px] border-vf-border bg-vf-card text-vf-mid text-sm font-semibold" @click="stopAndParseFork">
          Done — Apply Changes
        </button>
        <button class="text-sm text-vf-muted" @click="recognition?.stop(); forkStage = 'idle'; forkTranscript = ''">Cancel</button>
      </div>

      <!-- Fork: Processing -->
      <div v-else-if="forkStage === 'processing'" class="flex-1 flex flex-col items-center justify-center gap-4">
        <div class="w-14 h-14 rounded-full border-[3px] border-primary-soft border-t-primary animate-spin" />
        <p class="text-[15px] text-vf-mid">Applying your changes…</p>
      </div>

      <!-- Fork: Review -->
      <div v-else-if="forkStage === 'review' && forkParsed" class="flex-1 overflow-y-auto pb-6">
        <div class="px-4 py-3 bg-primary-bg border-b border-vf-border flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="#C8622A"/>
            <path d="M5 8l2.5 2.5L11 5.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-[13px] font-semibold text-primary">Changes applied! Add a note and save your version.</span>
        </div>

        <!-- Note -->
        <div class="border-t border-b border-vf-border">
          <div class="flex items-start gap-3 px-4 py-3.5">
            <span class="text-xs font-semibold text-vf-muted uppercase tracking-wide shrink-0 pt-1">My Note</span>
            <textarea
              v-model="forkNote"
              rows="2"
              class="flex-1 text-[15px] text-vf-text font-medium bg-transparent outline-none resize-none text-right leading-relaxed"
              placeholder="What makes your version special?"
            />
          </div>
        </div>

        <!-- Ingredients -->
        <VfSectionLabel>Ingredients</VfSectionLabel>
        <div class="border-t border-b border-vf-border">
          <div v-for="(_, i) in forkParsed.ingredients" :key="i" class="flex items-center gap-2.5 px-4 py-[11px] border-b border-vf-border">
            <div class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            <input v-model="forkParsed.ingredients[i]" class="flex-1 text-sm text-vf-text bg-transparent outline-none" placeholder="Ingredient" />
            <button class="text-vf-muted text-xl leading-none pl-2 hover:text-red-400 transition-colors" @click="forkParsed.ingredients.splice(i, 1)">×</button>
          </div>
          <button class="w-full px-4 py-3 text-sm text-primary font-semibold text-left hover:bg-primary-bg transition-colors" @click="forkParsed.ingredients.push('')">+ Add ingredient</button>
        </div>

        <!-- Steps -->
        <VfSectionLabel>Steps</VfSectionLabel>
        <div class="border-t border-b border-vf-border">
          <div v-for="(_, i) in forkParsed.steps" :key="i" class="flex gap-3 items-start px-4 py-3 border-b border-vf-border">
            <div class="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">{{ i + 1 }}</div>
            <textarea v-model="forkParsed.steps[i]" rows="2" class="flex-1 text-sm text-vf-text leading-[1.55] bg-transparent outline-none resize-none pt-0.5" placeholder="Step description" />
            <button class="text-vf-muted text-xl leading-none mt-0.5 hover:text-red-400 transition-colors" @click="forkParsed.steps.splice(i, 1)">×</button>
          </div>
          <button class="w-full px-4 py-3 text-sm text-primary font-semibold text-left hover:bg-primary-bg transition-colors" @click="forkParsed.steps.push('')">+ Add step</button>
        </div>

        <!-- Collapsible transcript -->
        <div class="border-t border-vf-border mt-2">
          <button class="w-full flex justify-between items-center px-4 py-3.5" @click="forkShowTranscript = !forkShowTranscript">
            <span class="text-xs font-semibold text-vf-muted uppercase tracking-wide">What you narrated</span>
            <svg :class="forkShowTranscript ? 'rotate-180' : ''" class="transition-transform text-vf-muted" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div v-if="forkShowTranscript" class="px-4 pb-4 flex flex-col gap-3">
            <textarea v-model="forkTranscript" rows="5" class="w-full text-sm text-vf-text bg-vf-card border border-vf-border rounded-xl p-3 outline-none resize-none leading-relaxed focus:border-primary transition-colors" />
            <button class="py-3 rounded-xl border-[1.5px] border-primary text-primary text-sm font-semibold hover:bg-primary-bg transition-colors" @click="parseForkTranscript">
              Apply Changes Again
            </button>
          </div>
        </div>

        <p v-if="forkError" class="text-red-500 text-sm text-center px-4 mt-3">{{ forkError }}</p>

        <div class="flex gap-2.5 px-4 pt-5">
          <button class="flex-1 py-3.5 rounded-2xl border-[1.5px] border-vf-border bg-vf-card text-vf-mid text-[15px] font-semibold" @click="forkStage = 'idle'; forkTranscript = ''">
            Re-record
          </button>
          <button
            class="flex-[2] py-3.5 rounded-2xl bg-primary text-white text-[15px] font-bold border-none disabled:opacity-60"
            :disabled="forkSaving"
            @click="saveFork"
          >
            {{ forkSaving ? 'Saving…' : 'Save My Version' }}
          </button>
        </div>
      </div>
    </template>

    <!-- FAB -->
    <button
      v-if="mode === 'view' && (canEditFork || canAddVersion)"
      class="fixed bottom-24 right-5 lg:bottom-10 w-14 h-14 rounded-full bg-primary shadow-[0_4px_24px_rgba(200,98,42,0.4)] flex items-center justify-center z-40 border-none transition-transform hover:scale-105 active:scale-95"
      @click="showSheet = true"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Bottom sheet -->
    <Teleport to="body">
      <div
        v-if="showSheet"
        class="fixed inset-0 bg-black/40 z-50 flex items-end"
        @click.self="showSheet = false"
      >
        <div class="w-full bg-vf-card rounded-t-3xl shadow-2xl pb-8">
          <div class="w-10 h-1 bg-vf-border rounded-full mx-auto mt-3 mb-5" />

          <p class="text-[11px] text-vf-muted uppercase tracking-wide font-semibold px-5 mb-1">{{ recipe?.name }}</p>

          <!-- Edit option -->
          <button
            v-if="canEditFork"
            class="w-full flex items-center gap-4 px-5 py-4 hover:bg-vf-surface transition-colors text-left"
            @click="startEdit"
          >
            <div class="w-11 h-11 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#C8622A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#C8622A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <p class="text-[15px] font-semibold text-vf-text">Edit this version</p>
              <p class="text-xs text-vf-muted mt-0.5">{{ fork?.author?.name }}'s version</p>
            </div>
          </button>

          <div v-if="canEditFork && canAddVersion" class="mx-5 h-px bg-vf-border" />

          <!-- Add version option -->
          <button
            v-if="canAddVersion"
            class="w-full flex items-center gap-4 px-5 py-4 hover:bg-vf-surface transition-colors text-left"
            @click="startFork"
          >
            <div class="w-11 h-11 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="6" cy="18" r="3" stroke="#C8622A" stroke-width="2"/>
                <circle cx="18" cy="6" r="3" stroke="#C8622A" stroke-width="2"/>
                <circle cx="18" cy="18" r="3" stroke="#C8622A" stroke-width="2"/>
                <path d="M6 15V9a3 3 0 003 3h6" stroke="#C8622A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <p class="text-[15px] font-semibold text-vf-text">Add my version</p>
              <p class="text-xs text-vf-muted mt-0.5">Branch from {{ fork?.author?.name?.split(' ')[0] }}'s version — narrate what's different</p>
            </div>
          </button>

          <button class="w-full py-4 text-sm text-vf-muted mt-1" @click="showSheet = false">Cancel</button>
        </div>
      </div>
    </Teleport>

  </div>
</template>
