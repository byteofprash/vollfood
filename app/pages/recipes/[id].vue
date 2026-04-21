<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const supabase = useSupabaseClient()

const { data: recipe } = await useAsyncData(`recipe-${route.params.id}`, async () => {
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

const versions = computed(() => recipe.value?.recipe_versions ?? [])
const fork = computed(() => versions.value[forkIndex.value])

function initials(name: string) {
  return name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
}

function cookLabel(min: number | null) {
  if (!min) return null
  if (min < 60) return `${min} min`
  return `${Math.floor(min / 60)}h ${min % 60 ? min % 60 + 'm' : ''}`
}
</script>

<template>
  <div class="h-screen flex flex-col bg-vf-bg">
    <VfHeader :title="recipe?.name ?? ''" :on-back="() => useRouter().back()">
      <template #right>
        <button
          v-if="versions.length > 1"
          :class="comparing
            ? 'bg-primary text-white'
            : 'bg-primary-bg text-primary'"
          class="rounded-full px-3.5 py-1.5 text-[13px] font-semibold border-none"
          @click="comparing = !comparing"
        >
          {{ comparing ? 'Single' : 'Compare' }}
        </button>
      </template>
    </VfHeader>

    <div class="flex-1 overflow-y-auto pb-6 lg:pb-8">
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
            :class="i === forkIndex
              ? 'border-primary bg-primary-bg'
              : 'border-vf-border bg-vf-card'"
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
            :class="activeTab === tab
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-vf-muted font-medium border-b-2 border-transparent'"
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
        <!-- Tab picker -->
        <div class="flex border-b border-vf-border bg-vf-card">
          <button
            v-for="tab in ['ingredients', 'steps'] as const"
            :key="tab"
            :class="activeTab === tab
              ? 'text-primary font-bold border-b-2 border-primary'
              : 'text-vf-muted font-medium border-b-2 border-transparent'"
            class="flex-1 py-3 text-sm capitalize"
            @click="activeTab = tab"
          >
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </div>

        <!-- Author headers -->
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

        <!-- Side-by-side rows -->
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
      </div><!-- /max-width wrapper -->
    </div>
  </div>
</template>
