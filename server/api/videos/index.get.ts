import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler, createError } from 'h3'
import { z } from 'zod'

// Exemple d'extension future : pagination, filtre, etc.
const querySchema = z.object({})

export default defineEventHandler(async event => {
  try {
    // Pour usage futur :
    // const query = querySchema.parse(getQuery(event))
    const client = await serverSupabaseClient(event)
    const {
      data: { user },
      error: userError
    } = await client.auth.getUser()
    if (userError || !user) {
      throw createError({ statusCode: 401, statusMessage: 'ERR_API_VIDEO_014: User not authenticated' })
    }
    const { data, error } = await client.from('videos').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (error) {
      throw createError({ statusCode: 500, statusMessage: `ERR_API_VIDEO_004: Database fetch failed [${error.message}]` })
    }
    return { videos: data }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
