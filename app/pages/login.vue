<template>
  <PageCard title="Connexion / Inscription" class="w-full max-w-md p-6">
    <div class="flex flex-col gap-4">
      <UInput v-model="userEmail" type="email" label="Email" placeholder="Votre email" autofocus />
      <UInput v-model="userPassword" type="password" label="Mot de passe" placeholder="Votre mot de passe" />
      <div class="flex flex-col gap-2 mt-2">
        <UButton block color="primary" :loading="isLoading" @click="signInWithPassword">Connexion</UButton>
        <UButton block color="neutral" :loading="isLoading" @click="signUpWithPassword">Créer un compte</UButton>
        <UButton block color="info" :loading="isLoading" @click="signInWithMagicLink">Magic Link</UButton>
        <UButton block color="success" :loading="isLoading" @click="signInWithGoogle">Google</UButton>
      </div>
      <UAlert
        v-if="errorMessage"
        title="Erreur"
        :description="errorMessage"
        color="error"
        variant="outline"
        class="mt-2" />
    </div>
  </PageCard>
</template>
<script setup lang="ts">
  definePageMeta({ layout: 'login' })
  const supabase = useSupabaseClient()
  const userEmail = ref<string>('')
  const userPassword = ref<string>('')
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string>('')

  const signInWithPassword = async (): Promise<void> => {
    isLoading.value = true
    errorMessage.value = ''
    const { error } = await supabase.auth.signInWithPassword({
      email: userEmail.value,
      password: userPassword.value,
    })
    if (error) errorMessage.value = error.message
    isLoading.value = false
  }

  const signUpWithPassword = async (): Promise<void> => {
    isLoading.value = true
    errorMessage.value = ''
    const { error } = await supabase.auth.signUp({
      email: userEmail.value,
      password: userPassword.value,
    })
    if (error) errorMessage.value = error.message
    isLoading.value = false
  }

  const signInWithMagicLink = async (): Promise<void> => {
    isLoading.value = true
    errorMessage.value = ''
    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail.value,
      options: { emailRedirectTo: 'http://localhost:3000/confirm' },
    })
    if (error) errorMessage.value = error.message
    isLoading.value = false
  }

  const signInWithGoogle = async (): Promise<void> => {
    isLoading.value = true
    errorMessage.value = ''
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) errorMessage.value = error.message
    isLoading.value = false
  }
</script>
