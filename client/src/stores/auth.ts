import { getUserIdFromToken } from '@/utils/auth'
import { publicTrpc } from '@/trpc'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

const useAuthStore = defineStore('auth', () => {
  const authToken: Ref<string | null> = ref(null)
  const authUserId = computed(() => (authToken.value ? getUserIdFromToken(authToken.value) : null))
  const isLoggedIn = computed(() => !!authToken.value)

  async function login(userLogin: { email: string; password: string }) {
    const { accessToken } = await publicTrpc.user.login.mutate(userLogin)

    authToken.value = accessToken
  }

  async function verifyWithRefreshToken() {
    const { accessToken } = await publicTrpc.user.verify.mutate()
    console.log('successfully verified with refresh token')
    authToken.value = accessToken
  }

  async function logout() {
    const router = useRouter()

    await publicTrpc.user.logout.mutate()
    authToken.value = null
    router.replace('/login')
  }

  return { authToken, authUserId, isLoggedIn, login, logout, verifyWithRefreshToken }
})

export default useAuthStore
