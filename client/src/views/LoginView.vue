<script setup lang="ts">
import { FwbHeading, FwbButton, FwbInput } from 'flowbite-vue'
import { ref } from 'vue'
import useAuthStore from '@/stores/auth'
import { useRouter } from 'vue-router'

// TODO : when login fails, need to show errors
const { authToken, login } = useAuthStore()
const router = useRouter()

const loginForm: Ref<{ email: string; password: string }> = ref({
  email: '',
  password: '',
})

async function onClickLogin() {
  await login(loginForm.value)

  router.push('/')
}
</script>
<template>
  <div class="h-full p-4 md:p-2 flex justify-center items-center">
    <form
      class="w-full max-w-md md:mx-auto my-8 mx-2 md:my-4"
      @submit.prevent="onClickLogin"
      @keyup.enter="onClickLogin"
    >
      <fwb-heading tag="h2" class="text-center my-4">Log in</fwb-heading>
      <div class="mb-5">
        <fwb-input
          v-model="loginForm.email"
          label="Email"
          placeholder="Enter your email"
          class="mb-2"
        />
      </div>
      <div class="mb-5">
        <fwb-input
          v-model="loginForm.password"
          label="Password"
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
