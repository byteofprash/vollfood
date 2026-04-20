<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const supabase = useSupabaseClient()
const sort = ref<'name' | 'time' | 'versions'>('name')

const { data: recipes, refresh } = await useAsyncData('all-recipes', async () => {
  const { data } = await supabase
    .from('recipes')
    .select('id, name, cooktime, serves, recipe_versions(id, author:profiles(id, name, hue))')
    .order('name')
  return data ?? []
})

const sorted = computed(() => {
  const list = [...(recipes.value ?? [])]
  if (sort.value === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
  else if (sort.value === 'time') list.sort((a, b) => (a.cooktime ?? 999) - (b.cooktime ?? 999))
  else list.sort((a, b) => b.recipe_versions.length - a.recipe_versions.length)
  return list
})

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
    <div class="flex-1 overflow-y-auto bg-vf-bg pb-20">
      <div class="px-4 pt-5 pb-3 flex justify-between items-end">
        <div>
          <div class="text-[22px] font-bold text-vf-text">All Recipes</div>
          <div class="text-[13px] text-vf-muted mt-0.5">{{ recipes?.length ?? 0 }} recipes</div>
        </div>
      </div>

      <!-- Sort pills -->
      <div class="flex gap-2 px-4 pb-3 overflow-x-auto">
        <button
          v-for="[val, label] in [['name', 'A–Z'], ['time', 'Quickest'], ['versions', 'Most Versions']]"
          :key="val"
          :class="sort === val
            ? 'border-primary bg-primary-bg text-primary'
            : 'border-vf-border bg-vf-card text-vf-muted'"
          class="px-3.5 py-1.5 rounded-full text-[13px] font-semibold border-[1.5px] flex-shrink-0"
          @click="sort = val as any"
        >
          {{ label }}
        </button>
      </div>

      <div class="border-t border-b border-vf-border">
        <VfRecipeRow
          v-for="r in sorted"
          :key="r.id"
          :recipe="{ ...r, versions: versionsList(r) }"
          @press="navigateTo(`/recipes/${r.id}`)"
        />
        <div v-if="!sorted.length" class="px-4 py-8 text-center text-sm text-vf-muted">
          No recipes yet.
        </div>
      </div>
    </div>
    <VfTabBar />
  </div>
</template>
