import { readMultipartFormData, sendError, defineEventHandler, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { parseVideoFormData } from '../../utils/parseVideoFormData'
import type { VideoFormPayload } from '../../../types/video'

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
    const client = await serverSupabaseClient(event)
    const { data, error } = await client
      .from('videos')
      .insert([{ name: payload.name, file: '', size: 0 }])
      .select()
    console.log('Insert:', { data, error })

    const { data: lastRows, error: selectError } = await client
      .from('videos')
      .select('id, name')
      .order('id', { ascending: false })
      .limit(5)
    console.log('Last rows:', lastRows, selectError)

    const insertError = error
    if (insertError) {
      throw createError({
        statusCode: 500,
        statusMessage: `ERR_API_VIDEO_003: Database insert failed [${insertError.message}]`,
      })
    }
    return { success: true }
  } catch (error: any) {
    sendError(event, createError({ statusCode: 400, statusMessage: error.message }))
  }
})
