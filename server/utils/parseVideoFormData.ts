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
  return {
    name
  }
}
