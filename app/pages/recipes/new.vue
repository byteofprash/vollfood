<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

type Stage = 'idle' | 'recording' | 'processing' | 'review'
const stage = ref<Stage>('idle')
const transcript = ref('')
const error = ref('')

interface Parsed {
  name: string
  category: string
  cooktime: number | null
  serves: number | null
  ingredients: string[]
  steps: string[]
}
const parsed = ref<Parsed | null>(null)

let recognition: any = null

function startRecording() {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) {
    error.value = 'Speech recognition is not supported in this browser. Try Chrome.'
    return
  }
  transcript.value = ''
  error.value = ''
  recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = 'en-US'
  recognition.onresult = (e: any) => {
    transcript.value = Array.from(e.results).map((r: any) => r[0].transcript).join(' ')
  }
  recognition.onerror = (e: any) => {
    error.value = `Mic error: ${e.error}`
    stage.value = 'idle'
  }
  recognition.start()
  stage.value = 'recording'
}

async function stopAndParse() {
  recognition?.stop()
  stage.value = 'processing'
  try {
    const res = await $fetch('/api/recipes/parse', {
      method: 'POST',
      body: { transcript: transcript.value },
    })
    parsed.value = res as Parsed
    stage.value = 'review'
  } catch (e: any) {
    error.value = e.message ?? 'Failed to parse recipe.'
    stage.value = 'idle'
  }
}

async function saveRecipe() {
  if (!parsed.value || !user.value) return
  error.value = ''
  try {
    const { profile } = useProfile()
    const familyId = profile.value?.family_id
    if (!familyId) throw new Error('You must belong to a family to add recipes.')

    const { data: recipe, error: recipeErr } = await supabase
      .from('recipes')
      .insert({ name: parsed.value.name, cooktime: parsed.value.cooktime, serves: parsed.value.serves, family_id: familyId })
      .select('id')
      .single()
    if (recipeErr) throw recipeErr

    await supabase.from('recipe_versions').insert({
      recipe_id: recipe.id,
      author_id: user.value.id,
      ingredients: parsed.value.ingredients,
      steps: parsed.value.steps,
      is_original: true,
    })

    await router.push(`/recipes/${recipe.id}`)
  } catch (e: any) {
    error.value = e.message ?? 'Failed to save recipe.'
  }
}

onUnmounted(() => recognition?.stop())
</script>

<template>
  <div class="h-screen flex flex-col bg-vf-bg">
    <VfHeader title="New Recipe" :on-back="() => router.back()" />

    <!-- Idle -->
    <div v-if="stage === 'idle'" class="flex-1 flex flex-col items-center justify-center px-6 gap-6">
      <div class="text-center">
        <p class="text-[20px] font-bold text-vf-text">Tell us your recipe</p>
        <p class="text-sm text-vf-muted mt-2 leading-relaxed">
          Speak naturally — describe the dish, ingredients, and steps in any order.
        </p>
      </div>

      <button
        class="w-[120px] h-[120px] rounded-full bg-primary flex items-center justify-center shadow-[0_8px_32px_rgba(200,98,42,0.33)] transition-transform hover:scale-105 active:scale-95 border-none"
        @click="startRecording"
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
          <rect x="9" y="2" width="6" height="11" rx="3" fill="white"/>
          <path d="M5 11a7 7 0 0014 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <path d="M12 18v3M9 21h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <p class="text-sm text-vf-muted">Tap to start speaking</p>

      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

      <div class="w-full h-px bg-vf-border my-2" />
      <NuxtLink to="/recipes/new/manual" class="text-sm text-vf-muted underline">Type instead</NuxtLink>
    </div>

    <!-- Recording -->
    <div v-else-if="stage === 'recording'" class="flex-1 flex flex-col items-center px-6 pt-8 gap-5">
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
        Listening…
      </p>

      <div class="w-full bg-vf-card rounded-2xl p-4 border border-vf-border min-h-[120px] flex-1">
        <p class="text-sm text-vf-text leading-relaxed">{{ transcript }}<span class="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" /></p>
      </div>

      <button
        class="px-7 py-3 rounded-full border-[1.5px] border-vf-border bg-vf-card text-vf-mid text-sm font-semibold"
        @click="stopAndParse"
      >
        Done — Parse Recipe
      </button>
      <button
        class="text-sm text-vf-muted"
        @click="recognition?.stop(); stage = 'idle'; transcript = ''"
      >
        Cancel
      </button>
    </div>

    <!-- Processing -->
    <div v-else-if="stage === 'processing'" class="flex-1 flex flex-col items-center justify-center gap-4">
      <div class="w-14 h-14 rounded-full border-[3px] border-primary-soft border-t-primary animate-spin" />
      <p class="text-[15px] text-vf-mid">Parsing your recipe…</p>
    </div>

    <!-- Review -->
    <div v-else-if="stage === 'review' && parsed" class="flex-1 overflow-y-auto pb-6">
      <div class="px-4 py-3 bg-primary-bg border-b border-vf-border flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" fill="#C8622A"/>
          <path d="M5 8l2.5 2.5L11 5.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="text-[13px] font-semibold text-primary">Recipe parsed! Review and save.</span>
      </div>

      <div class="border-t border-b border-vf-border">
        <div
          v-for="[label, value] in [['Name', parsed.name], ['Category', parsed.category], ['Cook Time', parsed.cooktime ? `${parsed.cooktime} min` : '—'], ['Serves', parsed.serves ?? '—']]"
          :key="label"
          class="flex justify-between items-center px-4 py-3.5 border-b border-vf-border last:border-0"
        >
          <span class="text-xs font-semibold text-vf-muted uppercase tracking-wide">{{ label }}</span>
          <span class="text-[15px] text-vf-text font-medium">{{ value }}</span>
        </div>
      </div>

      <VfSectionLabel>Ingredients</VfSectionLabel>
      <div class="border-t border-b border-vf-border">
        <div
          v-for="(ing, i) in parsed.ingredients"
          :key="i"
          class="flex items-center gap-2.5 px-4 py-[11px] border-b border-vf-border last:border-0"
        >
          <div class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
          <span class="text-sm text-vf-text">{{ ing }}</span>
        </div>
      </div>

      <VfSectionLabel>Steps</VfSectionLabel>
      <div class="border-t border-b border-vf-border">
        <div
          v-for="(step, i) in parsed.steps"
          :key="i"
          class="flex gap-3 items-start px-4 py-3 border-b border-vf-border last:border-0"
        >
          <div class="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {{ i + 1 }}
          </div>
          <span class="text-sm text-vf-text leading-[1.55] pt-0.5">{{ step }}</span>
        </div>
      </div>

      <p v-if="error" class="text-red-500 text-sm text-center px-4 mt-3">{{ error }}</p>

      <div class="flex gap-2.5 px-4 pt-5">
        <button
          class="flex-1 py-3.5 rounded-2xl border-[1.5px] border-vf-border bg-vf-card text-vf-mid text-[15px] font-semibold"
          @click="stage = 'idle'; transcript = ''"
        >
          Re-record
        </button>
        <button
          class="flex-[2] py-3.5 rounded-2xl bg-primary text-white text-[15px] font-bold border-none"
          @click="saveRecipe"
        >
          Save Recipe
        </button>
      </div>
    </div>
  </div>
</template>
