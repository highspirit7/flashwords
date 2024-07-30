import { getUserIdFromToken } from '@/utils/auth'
import trpc from '@/trpc'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

const useAuthStore = defineStore('auth', () => {
  const authToken: Ref<string | null> = ref(null)
  const authUserId = computed(() => (authToken.value ? getUserIdFromToken(authToken.value) : null))
  const isLoggedIn = computed(() => !!authToken.value)

  async function login(userLogin: { email: string; password: string }) {
    const { accessToken } = await trpc.user.login.mutate(userLogin)

    authToken.value = accessToken
  }

  async function logout() {
    const response = await trpc.user.logout.mutate()
    return response
  }

  return { authToken, authUserId, isLoggedIn, login, logout }
})

export default useAuthStore
