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
  import { h, resolveComponent } from 'vue'
  import type { TableColumn } from '@nuxt/ui'

  interface VideoRow {
    id: string
    name: string
    uploadDate: string
    videoSize: string
  }

  const columns: TableColumn<VideoRow & { action: string }>[] = [
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
      cell: () => [
        h(resolveComponent('UButton'), { color: 'primary', size: 'xs', label: 'Voir' }),
        h(resolveComponent('UButton'), { color: 'info', size: 'xs', label: 'Ajouter un hook', class: 'ml-2' }),
        h(resolveComponent('UButton'), { color: 'error', size: 'xs', label: 'Supprimer', class: 'ml-2' }),
      ],
    },
  ]

  const data: (VideoRow & { action: string })[] = [
    {
      id: '1',
      name: 'Video 1',
      uploadDate: '2025-06-27',
      videoSize: '120 MB',
    },
    {
      id: '2',
      name: 'Video 2',
      uploadDate: '2025-06-27',
      videoSize: '120 MB',
    },
    {
      id: '3',
      name: 'Video 3',
      uploadDate: '2025-06-27',
      videoSize: '120 MB',
    },
  ]
</script>
