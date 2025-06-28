import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler, createError } from 'h3'
import { z } from 'zod'

const idSchema = z.string().min(1, 'ERR_API_VIDEO_010: Missing or invalid video id')
const bodySchema = z.object({
  name: z.string().min(1, 'ERR_API_VIDEO_011: Invalid name')
})

export default defineEventHandler(async event => {
  try {
    const id = event.context.params?.id
    const parseId = idSchema.safeParse(id)
    if (!parseId.success) {
      throw createError({ statusCode: 400, statusMessage: parseId.error.errors[0].message })
    }
    const body = await useBody(event)
    const parseBody = bodySchema.safeParse(body)
    if (!parseBody.success) {
      throw createError({ statusCode: 400, statusMessage: parseBody.error.errors[0].message })
    }
    const client = await serverSupabaseClient(event)
    const { error } = await client.from('videos').update({ name: parseBody.data.name }).eq('id', id)
    if (error) {
      throw createError({ statusCode: 500, statusMessage: `ERR_API_VIDEO_012: Database update failed [${error.message}]` })
    }
    return { success: true }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
