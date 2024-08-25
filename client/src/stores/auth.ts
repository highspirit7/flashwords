import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { publicTrpc } from '@/trpc'
import { TRPCClientError } from '@trpc/client'
import { useToasterStore } from './toaster'
import { getUserIdFromToken } from '@/utils/auth'

const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const authToken: Ref<string | null> = ref(null)
  const authUserId = computed(() => (authToken.value ? getUserIdFromToken(authToken.value) : null))
  const isLoggedIn = computed(() => !!authToken.value)

  async function login(userLogin: { email: string; password: string }) {
    const { accessToken } = await publicTrpc.user.login.mutate(userLogin)

    authToken.value = accessToken
  }

  async function verifyWithRefreshToken() {
    try {
      const { accessToken } = await publicTrpc.user.verify.mutate()
      console.log('successfully verified with refresh token')
      authToken.value = accessToken
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    const toasterStore = useToasterStore()

    try {
      await publicTrpc.user.logout.mutate()
    } catch (error: unknown) {
      if (error instanceof TRPCClientError) {
        if (error.data?.httpStatus === 401) {
          toasterStore.danger({ text: error.message })
        }
      }
    } finally {
      $reset()
      router.replace('/login')
    }
  }

  function $reset() {
    authToken.value = null
  }

  return { authToken, authUserId, isLoggedIn, login, logout, verifyWithRefreshToken, $reset }
})

export default useAuthStore
