import { onMounted } from 'vue'
import { useSupabaseUser } from '#imports'
import { useUserStore } from '@/stores/user'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    onMounted(() => {
      const user = useSupabaseUser()
      const userStore = useUserStore()

      if (user.value) {
        userStore.setUser({
          id: String(user.value.id),
          email: String(user.value.email ?? ''),
          firstName: String(user.value.user_metadata?.firstName ?? ''),
          lastName: String(user.value.user_metadata?.lastName ?? ''),
        })
      } else {
        userStore.clearUser()
      }

      watch(
        user,
        newUser => {
          if (newUser) {
            userStore.setUser({
              id: String(newUser.id),
              email: String(newUser.email ?? ''),
              firstName: String(newUser.user_metadata?.firstName ?? ''),
              lastName: String(newUser.user_metadata?.lastName ?? ''),
            })
          } else {
            userStore.clearUser()
          }
        },
        { immediate: true },
      )
    })
  }
})
