<script setup lang="ts">
import { FwbHeading, FwbButton, FwbInput } from 'flowbite-vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '@/stores/auth'
import { useToasterStore } from '@/stores/toaster'
import { TRPCClientError } from '@trpc/client'

const { login } = useAuthStore()
const router = useRouter()

const loginForm: Ref<{ email: string; password: string }> = ref({
  email: '',
  password: '',
})
const toasterStore = useToasterStore()

async function onClickLogin() {
  try {
    await login(loginForm.value)
    toasterStore.success({ text: 'Successfully logged in!', timeout: 2000 })
  } catch (error: unknown) {
    let errorMessage = ''

    if (error instanceof TRPCClientError) {
      if (error.data.code === 'UNAUTHORIZED') {
        errorMessage = error.message
      } else {
        errorMessage = JSON.parse(error.message)[0].message
      }

      toasterStore.danger({ text: errorMessage, timeout: 5000 })
    }

    throw error
  }

  router.push('/')
}
</script>
<template>
  <div class="h-full p-4 md:p-2 flex justify-center items-center">
    <form class="w-full max-w-md md:mx-auto my-8 mx-2 md:my-4" @submit.prevent="onClickLogin">
      <fwb-heading tag="h2" class="text-center my-4">Log in</fwb-heading>
      <div class="mb-5">
        <fwb-input
          v-model="loginForm.email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          class="mb-2"
        />
      </div>
      <div class="mb-5">
        <fwb-input
          v-model="loginForm.password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          class="mb-2"
        />
      </div>
      <div class="flex justify-center items-center">
        <fwb-button size="lg" gradient="blue">Log in</fwb-button>
      </div>
    </form>
  </div>
</template>
