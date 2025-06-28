import type { VideoFormPayload } from '../../types/video'
import { z } from 'zod'

interface MultiPartField {
  name?: string
  data: string | Buffer
  filename?: string
  type?: string
}

const payloadSchema = z.object({
  name: z.string().min(1, 'ERR_API_VIDEO_002: Missing video name'),
  file: z.union([z.instanceof(Buffer), z.string().min(1)]),
  filename: z.string().min(1, 'ERR_API_VIDEO_002: Missing filename'),
  mimetype: z.string().optional()
})

export function parseVideoFormData(formData: MultiPartField[]): VideoFormPayload {
  const nameField = formData.find(f => f.name === 'name')
  const fileField = formData.find(f => f.name === 'file')
  const name = typeof nameField?.data === 'string' ? nameField?.data : nameField?.data?.toString()
  const file = fileField?.data
  const filename = fileField?.filename
  const mimetype = fileField?.type
  const parsed = payloadSchema.safeParse({ name, file, filename, mimetype })
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message)
  }
  return parsed.data
}
