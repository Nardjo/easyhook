<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="video?.name || 'Vidéo'">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #trailing>
          <UButton color="info" size="sm" label="Retour" to="/videos" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="flex flex-col gap-6">
        <div v-if="video">
          <video
            v-if="video.file"
            :src="video.file"
            controls
            class="w-full max-w-2xl rounded border border-default bg-black"
          />
          <div class="mt-4 flex items-center gap-4">
            <UInput
              v-model="editTitle"
              :disabled="isUpdating"
              class="w-80"
              placeholder="Titre de la vidéo"
            />
            <UButton
              color="primary"
              :loading="isUpdating"
              @click="updateTitle"
              label="Enregistrer"
            />
          </div>
        </div>
        <div v-else>
          <UAlert color="error" title="Vidéo introuvable" />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAsyncData } from '#app'
import { z } from 'zod'

const route = useRoute()
const router = useRouter()
const videoId = route.params.id as string

const videoSchema = z.object({
  id: z.string(),
  name: z.string(),
  file: z.string(),
})

const { data: video, error, refresh } = await useAsyncData('video', async () => {
  const response = await $fetch(`/api/videos/${videoId}`)
  const parsed = z.object({ video: videoSchema }).safeParse(response)
  if (!parsed.success) throw new Error('ERR_FRONT_VIDEO_003: Invalid API response')
  return parsed.data.video
})

const editTitle = ref(video.value?.name || '')
const isUpdating = ref(false)

watch(video, v => {
  if (v) editTitle.value = v.name
})

async function updateTitle() {
  if (!editTitle.value.trim()) return
  isUpdating.value = true
  try {
    await $fetch(`/api/videos/${videoId}`, {
      method: 'PUT',
      body: { name: editTitle.value },
    })
    await refresh()
  } catch (e) {
    // Optionally handle error
  } finally {
    isUpdating.value = false
  }
}

if (error.value) {
  router.replace('/videos')
}
</script>

<style scoped>
video {
  min-height: 300px;
}
</style>
