<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const supabase = useSupabaseClient()

const { data } = await useAsyncData(`member-${route.params.id}`, async () => {
  const [memberRes, recipesRes] = await Promise.all([
    supabase.from('profiles').select('id, name, hue, role').eq('id', route.params.id).single(),
    supabase
      .from('recipe_versions')
      .select('recipe:recipes(id, name, cooktime, serves, recipe_versions(id, author:profiles(id, name, hue)))')
      .eq('author_id', route.params.id),
  ])
  return {
    member: memberRes.data,
    recipes: (recipesRes.data ?? []).map((rv: any) => rv.recipe).filter(Boolean),
  }
})

const member = computed(() => data.value?.member)
const recipes = computed(() => data.value?.recipes ?? [])

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function versionsList(recipe: any) {
  return (recipe.recipe_versions ?? []).map((v: any) => ({
    author: v.author
      ? { ...v.author, initials: initials(v.author.name) }
      : null,
  }))
}
</script>

<template>
  <div class="h-screen flex flex-col bg-vf-bg">
    <VfHeader :title="member?.name?.split(' ')[0] ?? ''" :on-back="() => useRouter().back()" />
    <div class="flex-1 overflow-y-auto pb-6">
      <div v-if="member" class="flex items-center gap-4 px-4 py-5 border-b border-vf-border">
        <VfAvatar :name="member.name ?? ''" :initials="initials(member.name)" :hue="member.hue" :size="64" />
        <div>
          <div class="font-bold text-[18px] text-vf-text">{{ member.name }}</div>
          <div class="mt-1"><VfRoleBadge :role="member.role" /></div>
          <div class="text-[13px] text-vf-muted mt-1.5">{{ recipes.length }} recipe{{ recipes.length !== 1 ? 's' : '' }} contributed</div>
        </div>
      </div>

      <VfSectionLabel>Recipes</VfSectionLabel>
      <div class="border-t border-b border-vf-border">
        <VfRecipeRow
          v-for="r in recipes"
          :key="r.id"
          :recipe="{ ...r, versions: versionsList(r) }"
          @press="navigateTo(`/recipes/${r.id}`)"
        />
        <div v-if="!recipes.length" class="px-4 py-6 text-sm text-vf-muted">No recipes yet.</div>
      </div>
    </div>
  </div>
</template>
