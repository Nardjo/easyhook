<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div>Connexion en cours...</div>
  </div>
</template>
<script setup lang="ts">
  const user = useSupabaseUser()
  const redirectInfo = useSupabaseCookieRedirect()

  watch(
    user,
    () => {
      if (user.value) {
        const path = redirectInfo.pluck()
        return navigateTo(path || '/')
      }
    },
    { immediate: true },
  )
</script>
