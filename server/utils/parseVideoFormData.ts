import type { VideoFormPayload } from '../../types/video'

interface MultiPartField {
  name?: string
  data: string | Buffer
  filename?: string
  type?: string
}

export function parseVideoFormData(formData: MultiPartField[]): VideoFormPayload {
  const nameField = formData.find(f => f.name === 'name')
  if (!nameField || typeof nameField.name !== 'string') {
    throw new Error('ERR_API_VIDEO_002: Missing video name')
  }
  const name = typeof nameField.data === 'string' ? nameField.data : nameField.data.toString()
  if (!name) {
    throw new Error('ERR_API_VIDEO_002: Missing video name')
  }
  const fileField = formData.find(f => f.name === 'file')
  if (!fileField || !fileField.data) {
    return { name }
  }
  return {
    name,
    file: fileField.data,
    filename: fileField.filename,
    mimetype: fileField.type
  } as any // Cast to any for now; update VideoFormPayload if needed
}
