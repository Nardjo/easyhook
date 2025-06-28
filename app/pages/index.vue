<template>
  <UDashboardPanel id="home">
    <template #body>
      <pre>{{ session }}</pre>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useUserStore } from '@/stores/user'
  import { useSupabaseUser, useSupabaseClient } from '#imports'
  import { ref, onMounted } from 'vue'

  const userStore = useUserStore()
  const { id, email, firstName, lastName } = storeToRefs(userStore)
  const userFullName = computed(() => {
    if (firstName.value || lastName.value) return `${firstName.value ?? ''} ${lastName.value ?? ''}`.trim()
    return email.value ?? ''
  })

  const supabaseUser = useSupabaseUser()
  const supabase = useSupabaseClient()
  const session = ref<any>(null)

  onMounted(async () => {
    session.value = await supabase.auth.getSession()
  })
</script>
