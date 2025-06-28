import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler, createError } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'
import { z } from 'zod'

const idSchema = z.string().min(1, 'ERR_API_VIDEO_007: Missing or invalid video id')

export default defineEventHandler(async event => {
  try {
    if (!event.context.params || typeof event.context.params.id !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'ERR_API_VIDEO_007: Missing or invalid video id' })
    }
    const id = event.context.params.id
    const parseId = idSchema.safeParse(id)
    if (!parseId.success) {
      throw createError({ statusCode: 400, statusMessage: parseId.error.errors[0].message })
    }
    const client = await serverSupabaseClient(event)
    // Fetch file path to delete from disk
    const { data, error } = await client.from('videos').select('file').eq('id', id).single()
    if (error || !data) {
      throw createError({ statusCode: 404, statusMessage: `ERR_API_VIDEO_008: Video not found [${error?.message}]` })
    }
    // Delete file from disk
    const filePath = path.resolve(process.cwd(), 'public', data.file)
    await fs.unlink(filePath).catch(() => {})
    // Delete from DB
    const { error: dbError } = await client.from('videos').delete().eq('id', id)
    if (dbError) {
      throw createError({
        statusCode: 500,
        statusMessage: `ERR_API_VIDEO_009: Database delete failed [${dbError.message}]`,
      })
    }
    return { success: true }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})
