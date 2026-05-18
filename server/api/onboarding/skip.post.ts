import { serverSupabaseClient, serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const client = await serverSupabaseClient(event)  // user-JWT for profile ops
  const admin = serverSupabaseServiceRole(event)    // service role only for families INSERT

  const { data: profile } = await client.from('profiles').select('family_id, name').eq('id', user.id).single()
  if (profile?.family_id) return { success: true } // already in a family

  const firstName = (profile?.name ?? user.email ?? 'My').split(/[\s@]/)[0]
  // families has no INSERT policy — service role required here
  const { data: newFamily, error: famErr } = await admin
    .from('families')
    .insert({ name: `${firstName}'s Family`, invite_code: generateInviteCode() })
    .select('id')
    .single()
  if (famErr) throw createError({ statusCode: 500, message: famErr.message })

  // Profile UPDATE: user-JWT is fine ("users update own profile" policy)
  const { error: profErr } = await client
    .from('profiles')
    .update({ family_id: newFamily.id, role: 'admin' })
    .eq('id', user.id)
  if (profErr) throw createError({ statusCode: 500, message: profErr.message })

  return { success: true }
})
