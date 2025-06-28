import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler, createError } from 'h3'
import { z } from 'zod'

const idSchema = z.string().min(1, 'ERR_API_VIDEO_005: Missing or invalid video id')

export default defineEventHandler(async event => {
  try {
    const id = event.context.params?.id
    const parseResult = idSchema.safeParse(id)
    if (!parseResult.success) {
      throw createError({ statusCode: 400, statusMessage: parseResult.error.errors[0].message })
    }
    const client = await serverSupabaseClient(event)
    const { data, error } = await client.from('videos').select('*').eq('id', id).single()
    if (error) {
      throw createError({ statusCode: 404, statusMessage: `ERR_API_VIDEO_006: Video not found [${error.message}]` })
    }
    return { video: data }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
