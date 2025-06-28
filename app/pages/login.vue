<template>
  <UPageCar title="Connexion / Inscription" class="w-full max-w-md p-6">
    <div class="flex flex-col gap-4">
      <UInput v-model="userEmail" type="email" label="Email" placeholder="Votre email" autofocus />
      <UInput v-model="userPassword" type="password" label="Mot de passe" placeholder="Votre mot de passe" />
      <div class="flex flex-col gap-2 mt-2">
        <UButton block color="primary" :loading="isLoading" @click="signInWithPassword">Connexion</UButton>
        <UButton block color="neutral" variant="link" to="/register">Créer un compte</UButton>
        <!-- <UButton block color="info" :loading="isLoading" @click="signInWithMagicLink">Magic Link</UButton> -->
        <!-- <UButton block color="success" :loading="isLoading" @click="signInWithGoogle">Google</UButton> -->
      </div>
      <UAlert
        v-if="errorMessage"
        title="Erreur"
        :description="errorMessage"
        color="error"
        variant="outline"
        class="mt-2" />
    </div>
  </UPageCar>
</template>
<script setup lang="ts">
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  definePageMeta({ layout: 'login' })

  const EMAIL_REDIRECT_URL = 'http://localhost:4005/confirm'
  const ERROR_MESSAGES: Record<string, string> = {
    'Invalid login credentials': 'Identifiants invalides',
    'User already registered': 'Utilisateur déjà inscrit',
    'Email not confirmed': 'Veuillez confirmer votre email',
    'User not found': 'Utilisateur introuvable',
    'Invalid email or password': 'Email ou mot de passe invalide',
  }

  const supabase = useSupabaseClient()
  const userEmail = ref<string>('')
  const userPassword = ref<string>('')
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string>('')

  function translateErrorMessage(message: string): string {
    return ERROR_MESSAGES[message] ?? 'Erreur inconnue'
  }

  async function signInWithPassword(): Promise<void> {
    isLoading.value = true
    errorMessage.value = ''
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userEmail.value,
      password: userPassword.value,
    })
    if (error) errorMessage.value = translateErrorMessage(error.message)
    else if (data && data.user) {
      userStore.setUser({
        id: String(data.user.id),
        email: String(data.user.email ?? ''),
        firstName: String(data.user.user_metadata?.firstName ?? ''),
        lastName: String(data.user.user_metadata?.lastName ?? ''),
      })
      navigateTo('/confirm')
    }
    isLoading.value = false
  }

  async function signInWithMagicLink(): Promise<void> {
    isLoading.value = true
    errorMessage.value = ''
    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail.value,
      options: { emailRedirectTo: EMAIL_REDIRECT_URL },
    })
    if (error) errorMessage.value = translateErrorMessage(error.message)
    else {
      navigateTo('/confirm')
    }
    isLoading.value = false
  }

  async function signInWithGoogle(): Promise<void> {
    isLoading.value = true
    errorMessage.value = ''
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) errorMessage.value = translateErrorMessage(error.message)
    // The OAuth flow will redirect, so we do not handle user here
    isLoading.value = false
  }
</script>
