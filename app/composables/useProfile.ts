interface Profile {
  id: string
  family_id: string | null
  name: string | null
  role: 'admin' | 'editor' | 'contributor'
  hue: string
}

export const useProfile = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const profile = useState<Profile | null>('profile', () => null)

  const fetch = async () => {
    if (!user.value || profile.value) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
    profile.value = data
  }

  const role = computed(() => profile.value?.role ?? 'contributor')
  const familyId = computed(() => profile.value?.family_id ?? null)

  const joinFamily = async (inviteCode: string) => {
    const { data: family } = await supabase
      .from('families')
      .select('id')
      .eq('invite_code', inviteCode)
      .single()
    if (!family) throw new Error('Invalid invite code')
    await supabase
      .from('profiles')
      .update({ family_id: family.id })
      .eq('id', user.value!.id)
    profile.value = { ...profile.value!, family_id: family.id }
  }

  const clear = () => { profile.value = null }

  return { profile, role, familyId, fetch, joinFamily, clear }
}
