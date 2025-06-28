import { readMultipartFormData, sendError, defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { parseVideoFormData } from '../../utils/parseVideoFormData'
import type { VideoFormPayload } from '../../../types/video'
import { z } from 'zod'

import { promises as fs } from 'fs'
import path from 'path'

const payloadSchema = z.object({
  name: z.string().min(1, 'ERR_API_VIDEO_002: Missing video name'),
  file: z.union([z.instanceof(Buffer), z.string().min(1)]).refine(val => val, 'ERR_API_VIDEO_002: Missing file in payload'),
  filename: z.string().min(1, 'ERR_API_VIDEO_002: Missing filename'),
  mimetype: z.string().optional()
})

export default defineEventHandler(async event => {
  try {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({ statusCode: 400, statusMessage: 'ERR_API_VIDEO_001: Invalid form data' })
    }
    let payload: VideoFormPayload
    try {
      payload = parseVideoFormData(formData)
    } catch (err: any) {
      throw createError({ statusCode: 400, statusMessage: err.message })
    }
    const parsePayload = payloadSchema.safeParse(payload)
    if (!parsePayload.success) {
      throw createError({ statusCode: 400, statusMessage: parsePayload.error.errors[0].message })
    }
    // Stockage local du fichier
    const uploadDir = path.resolve(process.cwd(), 'public/videos')
    await fs.mkdir(uploadDir, { recursive: true })
    const fileName = parsePayload.data.filename
    const filePath = path.join(uploadDir, fileName)
    const fileBuffer = typeof parsePayload.data.file === 'string' ? Buffer.from(parsePayload.data.file) : parsePayload.data.file
    await fs.writeFile(filePath, fileBuffer)
    // Enregistrement en base
    const client = await serverSupabaseClient(event)
    const {
      data: { user },
      error: userError
    } = await client.auth.getUser()
    if (userError || !user) {
      throw createError({ statusCode: 401, statusMessage: 'ERR_API_VIDEO_013: User not authenticated' })
    }
    const { error: dbError } = await client
      .from('videos')
      .insert([{ name: parsePayload.data.name, file: `/videos/${fileName}`, size: fileBuffer?.byteLength || 0, user_id: user.id }])
    if (dbError) {
      throw createError({
        statusCode: 500,
        statusMessage: `ERR_API_VIDEO_003: Database insert failed [${dbError.message}]`,
      })
    }
    return { success: true, url: `/videos/${fileName}` }
  } catch (error: any) {
    sendError(event, createError({ statusCode: 400, statusMessage: error.message }))
  }
})
