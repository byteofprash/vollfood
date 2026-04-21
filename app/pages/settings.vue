<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { profile, fetch: fetchProfile, clear } = useProfile()

await fetchProfile()

const members = ref<any[]>([])
const expanded = ref<string | null>(null)
const inviteEmail = ref('')
const inviteError = ref('')
const inviteSuccess = ref(false)
const showInvite = ref(false)

if (profile.value?.role === 'admin') {
  const { data } = await supabase.from('profiles').select('id, name, hue, role').order('name')
  members.value = data ?? []
}

function initials(name: string | null) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

async function changeRole(memberId: string, role: string) {
  await supabase.from('profiles').update({ role }).eq('id', memberId)
  const m = members.value.find(m => m.id === memberId)
  if (m) m.role = role
}

async function removeMember(memberId: string) {
  await supabase.from('profiles').update({ family_id: null }).eq('id', memberId)
  members.value = members.value.filter(m => m.id !== memberId)
  expanded.value = null
}

async function inviteMember() {
  inviteError.value = ''
  inviteSuccess.value = false
  try {
    const { data: { session } } = await supabase.auth.getSession()
    await $fetch('/api/admin/invite', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session?.access_token}` },
      body: { email: inviteEmail.value },
    })
    inviteSuccess.value = true
    inviteEmail.value = ''
    showInvite.value = false
  } catch (e: any) {
    inviteError.value = e.message ?? 'Failed to send invite.'
  }
}

async function signOut() {
  await supabase.auth.signOut()
  clear()
  await navigateTo('/login')
}
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="flex-1 overflow-y-auto bg-vf-bg pb-20 lg:pb-8">
      <div class="lg:max-w-2xl lg:mx-auto lg:px-8">
      <div class="px-4 lg:px-0 pt-5 pb-3">
        <div class="text-[22px] font-bold text-vf-text">Settings</div>
      </div>

      <!-- My Profile -->
      <VfSectionLabel>My Profile</VfSectionLabel>
      <div class="border-t border-b border-vf-border bg-vf-card">
        <div v-if="profile" class="flex items-center gap-3 px-4 py-3.5">
          <VfAvatar :name="profile.name ?? ''" :initials="initials(profile.name)" :hue="profile.hue" :size="48" />
          <div>
            <div class="font-semibold text-base text-vf-text">{{ profile.name }}</div>
            <div class="text-xs text-vf-muted">{{ user?.email }}</div>
          </div>
          <div class="ml-auto"><VfRoleBadge :role="profile.role" /></div>
        </div>
        <div class="flex justify-between items-center px-4 py-3.5 border-t border-vf-border">
          <span class="text-[15px] text-vf-text">Email</span>
          <span class="text-sm text-vf-muted">{{ user?.email }}</span>
        </div>
      </div>

      <!-- Family Members (admin only) -->
      <template v-if="profile?.role === 'admin'">
        <VfSectionLabel>Family Members</VfSectionLabel>
        <div class="border-t border-b border-vf-border bg-vf-card">
          <div v-for="m in members" :key="m.id">
            <div
              class="flex items-center gap-2.5 px-4 py-3 border-b border-vf-border cursor-pointer transition-colors hover:bg-vf-surface"
              @click="expanded = expanded === m.id ? null : m.id"
            >
              <VfAvatar :name="m.name ?? ''" :initials="initials(m.name)" :hue="m.hue" :size="36" />
              <div class="flex-1">
                <div class="text-[15px] font-medium text-vf-text">{{ m.name }}</div>
              </div>
              <VfRoleBadge :role="m.role" />
              <svg
                v-if="m.id !== user?.id"
                width="7" height="12" viewBox="0 0 7 12" fill="none"
                :style="{ transform: expanded === m.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }"
              >
                <path d="M1 1l5 5-5 5" stroke="#B8967A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <!-- Role editor -->
            <div v-if="expanded === m.id && m.id !== user?.id" class="bg-vf-surface px-4 py-2.5 flex gap-2 flex-wrap border-b border-vf-border">
              <button
                v-for="role in ['admin', 'editor', 'contributor']"
                :key="role"
                :style="{
                  borderColor: role === m.role ? '#C8622A' : '#EDE3D8',
                  background: role === m.role ? '#C8622A20' : '#fff',
                  color: role === m.role ? '#C8622A' : '#B8967A',
                }"
                class="px-3 py-1.5 rounded-full text-xs font-semibold border-[1.5px] capitalize"
                @click="changeRole(m.id, role)"
              >
                {{ role }}
              </button>
              <button
                class="ml-auto px-3 py-1.5 rounded-full text-xs font-semibold border-[1.5px] border-red-400 bg-red-50 text-red-500"
                @click="removeMember(m.id)"
              >
                Remove
              </button>
            </div>
          </div>

          <!-- Invite button -->
          <div
            class="flex items-center gap-2.5 px-4 py-3.5 cursor-pointer hover:bg-vf-surface transition-colors"
            @click="showInvite = !showInvite"
          >
            <div class="w-9 h-9 rounded-full bg-primary-bg border-[1.5px] border-dashed border-primary flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="#C8622A" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="text-[15px] text-primary font-semibold">Invite Family Member</span>
          </div>

          <!-- Invite form -->
          <div v-if="showInvite" class="px-4 py-3 border-t border-vf-border bg-primary-bg">
            <div class="flex gap-2">
              <input
                v-model="inviteEmail"
                type="email"
                placeholder="Email address"
                class="flex-1 bg-white border border-vf-border rounded-xl px-3 py-2 text-sm text-vf-text outline-none"
              />
              <button
                class="px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold border-none"
                @click="inviteMember"
              >
                Send
              </button>
            </div>
            <p v-if="inviteError" class="text-red-500 text-xs mt-2">{{ inviteError }}</p>
            <p v-if="inviteSuccess" class="text-primary text-xs mt-2">Invite sent!</p>
          </div>
        </div>
      </template>

      <!-- Cookbook settings -->
      <VfSectionLabel>Cookbook</VfSectionLabel>
      <div class="border-t border-b border-vf-border bg-vf-card">
        <div
          v-for="([label, val], i) in [['Default Serves', '4'], ['Language', 'English']]"
          :key="label"
          :class="i > 0 ? 'border-t border-vf-border' : ''"
          class="flex justify-between items-center px-4 py-3.5"
        >
          <span class="text-[15px] text-vf-text">{{ label }}</span>
          <div class="flex items-center gap-1.5">
            <span class="text-sm text-vf-muted">{{ val }}</span>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M1 1l5 5-5 5" stroke="#B8967A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="text-center px-4 py-6">
        <button class="text-red-500 text-[15px] font-semibold bg-none border-none" @click="signOut">Sign Out</button>
      </div>
      </div><!-- /max-width wrapper -->
    </div>
    <VfTabBar />
  </div>
</template>
