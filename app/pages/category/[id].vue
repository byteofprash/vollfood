<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const supabase = useSupabaseClient()

const { data } = await useAsyncData(`category-${route.params.id}`, async () => {
  const [catRes, recipesRes] = await Promise.all([
    supabase.from('categories').select('*').eq('id', route.params.id).single(),
    supabase
      .from('recipes')
      .select('id, name, cooktime, serves, recipe_versions(id, author:profiles(id, name, hue))')
      .eq('category_id', route.params.id)
      .order('name'),
  ])
  return { category: catRes.data, recipes: recipesRes.data ?? [] }
})

const category = computed(() => data.value?.category)
const recipes = computed(() => data.value?.recipes ?? [])

function versionsList(recipe: any) {
  return (recipe.recipe_versions ?? []).map((v: any) => ({
    author: v.author
      ? { ...v.author, initials: v.author.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() }
      : null,
  }))
}
</script>

<template>
  <div class="h-screen flex flex-col bg-vf-bg">
    <VfHeader :title="category?.name ?? 'Category'" :on-back="() => useRouter().back()" />
    <div class="flex-1 overflow-y-auto pb-4">
      <p class="px-4 py-3 text-[13px] text-vf-muted">{{ recipes.length }} recipe{{ recipes.length !== 1 ? 's' : '' }}</p>
      <div class="border-t border-b border-vf-border">
        <VfRecipeRow
          v-for="r in recipes"
          :key="r.id"
          :recipe="{ ...r, versions: versionsList(r) }"
          @press="navigateTo(`/recipes/${r.id}`)"
        />
        <div v-if="!recipes.length" class="px-4 py-8 text-center text-sm text-vf-muted">
          No recipes yet. Be the first to add one!
        </div>
      </div>
    </div>
  </div>
</template>
