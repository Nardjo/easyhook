import { readMultipartFormData, sendError, defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { parseVideoFormData } from '../../utils/parseVideoFormData'
import type { VideoFormPayload } from '../../../types/video'

import { promises as fs } from 'fs'
import path from 'path'

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
    if (!payload.file) {
      throw createError({ statusCode: 400, statusMessage: 'ERR_API_VIDEO_002: Missing file in payload' })
    }
    // Stockage local du fichier
    const uploadDir = path.resolve(process.cwd(), 'public/videos')
    await fs.mkdir(uploadDir, { recursive: true })
    const fileName = payload.filename || `${Date.now()}_video` // fallback if no filename
    const filePath = path.join(uploadDir, fileName)
    const fileBuffer = typeof payload.file === 'string' ? Buffer.from(payload.file) : payload.file
    await fs.writeFile(filePath, fileBuffer)
    // Enregistrement en base
    const client = await serverSupabaseClient(event)
    const { error: dbError } = await client
      .from('videos')
      .insert([{ name: payload.name, file: `/videos/${fileName}`, size: fileBuffer?.byteLength || 0 }])
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
