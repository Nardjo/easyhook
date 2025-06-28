import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async event => {
  const client = await serverSupabaseClient(event)
  const { error } = await client.auth.signOut()
  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }
  return {
    success: true,
  }
})
