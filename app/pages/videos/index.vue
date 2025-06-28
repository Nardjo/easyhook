<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Vidéos">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #trailing>
          <UBadge :label="data.length" variant="subtle" />
        </template>

        <template #right>
          <UButton color="info" size="sm" label="Ajouter une vidéo" to="/videos/add" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UTable
        :data
        :columns
        class="shrink-0"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
        }" />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
  import type { TableColumn } from '@nuxt/ui'
  import { z } from 'zod'

  interface VideoRow {
    id: string
    name: string
    uploadDate: string
    videoSize: string
  }

  const columns: TableColumn<VideoRow>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'name',
      header: 'Nom',
    },
    {
      accessorKey: 'uploadDate',
      header: "Date d'upload",
    },
    {
      accessorKey: 'videoSize',
      header: 'Taille vidéo',
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: cell => [
        h(resolveComponent('UButton'), {
          color: 'primary',
          size: 'xs',
          label: 'Modifier',
          onClick: () => navigateTo({ name: 'videos-id', params: { id: cell.row.id } }),
        }),
        h(resolveComponent('UButton'), { color: 'info', size: 'xs', label: 'Ajouter un hook', class: 'ml-2' }),
        h(resolveComponent('UButton'), { color: 'error', size: 'xs', label: 'Supprimer', class: 'ml-2' }),
      ],
    },
  ]

  const videoRowSchema = z.object({
    id: z.string(),
    name: z.string(),
    created_at: z.string(),
    file: z.string(),
    size: z.number().optional(),
  })
  const apiResponseSchema = z.object({
    videos: z.array(videoRowSchema),
  })

  const { data: apiData, error } = await useAsyncData('videos', async () => {
    const response = await $fetch('/api/videos')
    const parsed = apiResponseSchema.safeParse(response)
    if (!parsed.success) {
      throw new Error('ERR_FRONT_VIDEO_001: Invalid API response')
    }
    return parsed.data.videos.map(video => ({
      id: video.id,
      name: video.name,
      uploadDate: video.created_at.split('T')[0],
      videoSize: video.size ? `${(video.size / 1024 / 1024).toFixed(2)} MB` : '—',
    }))
  })

  // if (error.value) {
  //   throw new Error('ERR_FRONT_VIDEO_002: Failed to fetch videos')
  // }

  const data = apiData.value ?? []
</script>
