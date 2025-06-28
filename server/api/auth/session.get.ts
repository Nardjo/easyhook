import { serverSupabaseUser } from '#supabase/server'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    return { user: null }
  }
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name ?? '',
    }
  }
})
