import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const { email } = await readBody(event)
  if (!email) throw createError({ statusCode: 400, message: 'Email required' })

  const config = useRuntimeConfig()
  const supabaseAdmin = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey,
  )

  // Verify caller is admin via their session token
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token)
  if (authErr || !user) throw createError({ statusCode: 401, message: 'Invalid session' })

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, family_id')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw createError({ statusCode: 403, message: 'Admins only' })

  // Invite the user and pre-assign their family via user metadata
  const { error: inviteErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { family_id: profile.family_id, role: 'contributor' },
  })
  if (inviteErr) throw createError({ statusCode: 500, message: inviteErr.message })

  return { ok: true }
})
