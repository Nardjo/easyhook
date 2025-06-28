<template>
  <UPageCard title="Créer un compte" class="w-full max-w-md p-6">
    <div class="flex flex-col gap-4">
      <UInput v-model="userFirstName" type="text" label="Prénom" placeholder="Votre prénom" autofocus />
      <UInput v-model="userLastName" type="text" label="Nom" placeholder="Votre nom" />
      <UInput v-model="userEmail" type="email" label="Email" placeholder="Votre email" />
      <UInput v-model="userPassword" type="password" label="Mot de passe" placeholder="Votre mot de passe" />
      <UInput
        v-model="userPasswordConfirm"
        type="password"
        label="Confirmer le mot de passe"
        placeholder="Confirmez le mot de passe" />
      <div class="flex flex-col gap-2 mt-2">
        <UButton block color="primary" :loading="isLoading" @click="register">Créer un compte</UButton>
        <UButton block color="neutral" to="/login">Déjà inscrit ? Se connecter</UButton>
      </div>
      <UAlert
        v-if="errorMessage"
        title="Erreur"
        :description="errorMessage"
        color="error"
        variant="outline"
        class="mt-2" />
      <UAlert
        v-if="successMessage"
        title="Succès"
        :description="successMessage"
        color="success"
        variant="outline"
        class="mt-2" />
    </div>
  </UPageCard>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { useUserStore } from '@/stores/user'

  const userStore = useUserStore()
  definePageMeta({ layout: 'login' })

  const EMAIL_REDIRECT_URL = 'http://localhost:4005/confirm'
  const ERROR_MESSAGES: Record<string, string> = {
    'User already registered': 'Utilisateur déjà inscrit',
    'Email not confirmed': 'Veuillez confirmer votre email',
    'Invalid email or password': 'Email ou mot de passe invalide',
  }

  const supabase = useSupabaseClient()
  const userFirstName = ref<string>('')
  const userLastName = ref<string>('')
  const userEmail = ref<string>('')
  const userPassword = ref<string>('')
  const userPasswordConfirm = ref<string>('')
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string>('')
  const successMessage = ref<string>('')

  function translateErrorMessage(message: string): string {
    return ERROR_MESSAGES[message] ?? 'Erreur inconnue'
  }

  async function register(): Promise<void> {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    if (userPassword.value !== userPasswordConfirm.value) {
      errorMessage.value = 'Les mots de passe ne correspondent pas.'
      isLoading.value = false
      return
    }
    const { data, error } = await supabase.auth.signUp({
      email: userEmail.value,
      password: userPassword.value,
      options: {
        emailRedirectTo: EMAIL_REDIRECT_URL,
        data: {
          firstName: userFirstName.value,
          lastName: userLastName.value,
        },
      },
    })
    if (error) {
      errorMessage.value = translateErrorMessage(error.message)
    } else if (data && data.user) {
      userStore.setUser({
        id: String(data.user.id),
        email: String(data.user.email ?? ''),
        firstName: String(data.user.user_metadata?.firstName ?? ''),
        lastName: String(data.user.user_metadata?.lastName ?? ''),
      })
      successMessage.value = 'Inscription réussie. Vérifiez votre email pour confirmer votre compte.'
    }
    isLoading.value = false
  }
</script>
