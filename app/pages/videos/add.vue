<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Ajouter une vidéo">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #trailing>
          <UButton color="neutral" size="sm" label="Retour" @click="router.back()" />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UCard :ui="{ root: 'max-w-7xl' }">
        <UForm :state="formState" class="flex flex-col gap-4 mt-8" @submit="handleSubmit">
          <UFormField name="name" label="Nom de la vidéo" required>
            <UInput v-model="formState.name" placeholder="Titre de la vidéo" />
          </UFormField>
          <UFormField name="videoFile" label="Fichier vidéo" required>
            <UInput type="file" accept="video/*" @change="handleFileChange" />
          </UFormField>
          <div class="flex justify-end">
            <UButton color="info" type="submit" label="Ajouter" />
          </div>
        </UForm>
      </UCard>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const formState = ref({
    name: '',
    file: null as File | null,
  })

  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    formState.value.file = target.files?.[0] ?? null
  }

  async function handleSubmit() {
    if (!formState.value.name || !formState.value.file) return
    const formData = new FormData()
    formData.append('name', formState.value.name)
    formData.append('file', formState.value.file)
    const response = await fetch('/api/videos/add', { method: 'POST', body: formData, credentials: 'include' })
    console.log(response)
    // router.push('/videos')
  }
</script>
