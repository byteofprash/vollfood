<script setup lang="ts">
defineProps<{
  recipe: {
    id: string
    name: string
    cooktime: number | null
    serves: number | null
    versions: Array<{
      author: { id: string; name: string; initials: string; hue: string } | null
    }>
  }
}>()

defineEmits<{ press: [] }>()

function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}
</script>

<template>
  <div
    class="flex items-center gap-3 px-4 py-3 border-b border-vf-border bg-vf-card cursor-pointer transition-colors hover:bg-primary-bg"
    @click="$emit('press')"
  >
    <VfRecipePlaceholder :id="recipe.id" :size="52" />

    <div class="flex-1 min-w-0">
      <div class="font-semibold text-[15px] text-vf-text mb-1 truncate">{{ recipe.name }}</div>
      <div class="flex items-center gap-1">
        <!-- Stacked author avatars -->
        <div class="flex items-center">
          <div
            v-for="(v, i) in recipe.versions.slice(0, 4)"
            :key="i"
            :style="{
              width: '18px',
              height: '18px',
              background: v.author?.hue ?? '#C8622A',
              marginLeft: i > 0 ? '-5px' : '0',
              zIndex: 10 - i,
              fontSize: '7px',
            }"
            class="rounded-full border-[1.5px] border-white flex items-center justify-center text-white font-bold relative"
          >
            {{ v.author ? initials(v.author.name) : '?' }}
          </div>
        </div>
        <span v-if="recipe.cooktime" class="text-xs text-vf-muted">
          · {{ recipe.cooktime }} min
        </span>
      </div>
    </div>

    <div class="flex flex-col items-end gap-1">
      <span
        v-if="recipe.versions.length > 1"
        class="text-[11px] font-semibold text-primary bg-primary-bg px-1.5 py-0.5 rounded-full"
      >
        {{ recipe.versions.length }} versions
      </span>
      <span v-if="recipe.serves" class="text-xs text-vf-muted">{{ recipe.serves }} servings</span>
    </div>
  </div>
</template>
