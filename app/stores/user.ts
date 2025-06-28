import { defineStore } from 'pinia'

interface UserState {
  id: string | null
  email: string | null
  firstName: string | null
  lastName: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: null,
    email: null,
    firstName: null,
    lastName: null,
  }),
  actions: {
    setUser(user: { id: string; email: string; firstName: string; lastName: string }) {
      this.id = user.id
      this.email = user.email
      this.firstName = user.firstName
      this.lastName = user.lastName
    },
    clearUser() {
      this.id = null
      this.email = null
      this.firstName = null
      this.lastName = null
    },
  },
})
