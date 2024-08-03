<script setup lang="ts">
import { FwbHeading, FwbButton, FwbInput } from 'flowbite-vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '@/stores/auth'
import { useToasterStore } from '@/stores/toaster'
import { TRPCClientError } from '@trpc/client'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import { assertError } from '@/utils/errors'

const { login } = useAuthStore()
const router = useRouter()

const loginForm: Ref<{ email: string; password: string }> = ref({
  email: '',
  password: '',
})
const toasterStore = useToasterStore()
const errorMessage = ref('')

function checkIfFormIsBlank() {
  if (loginForm.value.password === '') {
    errorMessage.value = 'Password cannot be left blank.'
  }

  if (loginForm.value.email === '') {
    errorMessage.value = 'Email cannot be left blank.'
  }
}

async function onClickLogin() {
  errorMessage.value = ''
  checkIfFormIsBlank()

  if (errorMessage.value) return

  try {
    await login(loginForm.value)
    toasterStore.success({ text: 'Successfully logged in!', timeout: 2000 })
    router.replace('/')
  } catch (error: unknown) {
    if (error instanceof TRPCClientError) {
      if (error.data?.httpStatus === 500) {
        errorMessage.value = DEFAULT_SERVER_ERROR
      } else {
        errorMessage.value = 'Your login details are not correct. Please try again.'
      }
    } else {
      assertError(error)
      errorMessage.value = error.message
    }
  }
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

      <div
        v-show="errorMessage !== ''"
        class="my-4 w-full font-semibold p-4 border-2 rounded-md border-red-500 text-red-500"
      >
        {{ errorMessage }}
      </div>

      <div class="flex justify-center items-center">
        <fwb-button size="lg" gradient="blue">Log in</fwb-button>
      </div>
    </form>
  </div>
</template>
