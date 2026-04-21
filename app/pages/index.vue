<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { profile, fetch: fetchProfile } = useProfile()

const categories = ref<any[]>([])
const recentRecipes = ref<any[]>([])
const search = ref('')
const searchResults = ref<any[]>([])
const searching = ref(false)

await fetchProfile()

const [catRes, recipeRes] = await Promise.all([
  supabase.from('categories').select('*').order('sort_order'),
  supabase
    .from('recipes')
    .select('id, name, cooktime, serves, recipe_versions(id, author:profiles(id, name, hue))')
    .order('created_at', { ascending: false })
    .limit(4),
])
categories.value = catRes.data ?? []
recentRecipes.value = recipeRes.data ?? []

watch(search, async (q) => {
  if (!q.trim()) { searchResults.value = []; return }
  searching.value = true
  const { data } = await supabase
    .from('recipes')
    .select('id, name, cooktime, serves, recipe_versions(id, author:profiles(id, name, hue))')
    .ilike('name', `%${q}%`)
    .limit(20)
  searchResults.value = data ?? []
  searching.value = false
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
})

const firstName = computed(() => profile.value?.name?.split(' ')[0] ?? 'Chef')

function versionsList(recipe: any) {
  return (recipe.recipe_versions ?? []).map((v: any) => ({
    author: v.author
      ? { ...v.author, initials: v.author.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() }
      : null,
  }))
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="flex-1 overflow-y-auto bg-vf-bg pb-20 lg:pb-8">
      <div class="lg:max-w-4xl lg:mx-auto lg:px-8">
      <!-- Greeting -->
      <div class="px-4 lg:px-0 pt-5 pb-3 flex justify-between items-center">
        <div>
          <div class="text-[22px] font-bold text-vf-text">{{ greeting }}, {{ firstName }} 👋</div>
          <div class="text-[13px] text-vf-muted mt-0.5">{{ recentRecipes.length }} recent recipes</div>
        </div>
        <VfAvatar
          v-if="profile"
          :name="profile.name ?? ''"
          :initials="(profile.name ?? 'U').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()"
          :hue="profile.hue"
          :size="40"
        />
      </div>

      <!-- Add recipe CTA -->
      <NuxtLink
        to="/recipes/new"
        class="mx-4 mb-3 mt-1 bg-primary rounded-2xl px-4 py-3.5 flex items-center gap-3.5 no-underline shadow-[0_4px_18px_rgba(200,98,42,0.27)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <div class="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="11" rx="3" fill="white"/>
            <path d="M5 11a7 7 0 0014 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 18v3M9 21h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          <div class="text-[15px] font-bold text-white">Add new recipe</div>
          <div class="text-xs text-white/75 mt-0.5">Speak it — we'll handle the rest</div>
        </div>
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" class="ml-auto">
          <path d="M1 1l6 6-6 6" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </NuxtLink>

      <!-- Search -->
      <div class="mx-4 mb-1 bg-vf-card rounded-2xl border border-vf-border flex items-center px-3.5 py-2.5 gap-2.5">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="#B8967A" stroke-width="1.8"/>
          <path d="M11 11l3 3" stroke="#B8967A" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        <input
          v-model="search"
          placeholder="Search recipes…"
          class="flex-1 bg-transparent text-[15px] text-vf-text outline-none"
        />
      </div>

      <!-- Search results -->
      <div v-if="search.trim()" class="mt-3">
        <VfSectionLabel>Results</VfSectionLabel>
        <div class="border-t border-b border-vf-border">
          <VfRecipeRow
            v-for="r in searchResults"
            :key="r.id"
            :recipe="{ ...r, versions: versionsList(r) }"
            @press="navigateTo(`/recipes/${r.id}`)"
          />
          <div v-if="!searching && !searchResults.length" class="px-4 py-5 text-sm text-vf-muted">No recipes found.</div>
        </div>
      </div>

      <!-- Categories + Recent -->
      <template v-else>
        <VfSectionLabel>Categories</VfSectionLabel>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 px-4 lg:px-0">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.id"
            :to="`/category/${cat.id}`"
            :style="{ background: cat.accent + '18', borderColor: cat.accent + '30' }"
            class="border rounded-2xl px-3.5 py-4 no-underline transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div class="text-[15px] font-bold text-vf-text">{{ cat.name }}</div>
            <div :style="{ color: cat.accent }" class="text-xs font-semibold mt-1">
              {{ cat.recipe_count ?? '' }}
            </div>
          </NuxtLink>
        </div>

        <VfSectionLabel>Recently Added</VfSectionLabel>
        <div class="border-t border-b border-vf-border">
          <VfRecipeRow
            v-for="r in recentRecipes"
            :key="r.id"
            :recipe="{ ...r, versions: versionsList(r) }"
            @press="navigateTo(`/recipes/${r.id}`)"
          />
          <div v-if="!recentRecipes.length" class="px-4 py-8 text-center text-sm text-vf-muted">
            No recipes yet. Add the first one!
          </div>
        </div>
      </template>
      </div><!-- /max-width wrapper -->
    </div>

    <VfTabBar />
  </div>
</template>
