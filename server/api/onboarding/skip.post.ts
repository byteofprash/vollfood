import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const client = await serverSupabaseClient(event)

  const { data: profile } = await client.from('profiles').select('family_id, name').eq('id', user.id).single()
  if (profile?.family_id) return { success: true }

  const firstName = (profile?.name ?? user.email ?? 'My').split(/[\s@]/)[0]
  const { error } = await client.rpc('setup_family_for_user', {
    p_family_name: `${firstName}'s Family`,
    p_invite_code: generateInviteCode(),
  })
  if (error) throw createError({ statusCode: 500, message: error.message })

  return { success: true }
})
