<script setup lang="ts">
import { FwbJumbotron, FwbButton } from 'flowbite-vue'
import { RouterLink } from 'vue-router'
import { onMounted } from 'vue'
import useAuthStore from '@/stores/auth'
import { TRPCClientError } from '@trpc/client'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import { useToasterStore } from '@/stores/toaster'
import { assertError } from '@/utils/errors'

const authStore = useAuthStore()
const toasterStore = useToasterStore()

onMounted(async () => {
  try {
    await authStore.verifyWithRefreshToken()
  } catch (error: unknown) {
    if (error instanceof TRPCClientError) {
      const errorMessage =
        error.data?.httpStatus === 401
          ? error.message.includes('does not exist')
            ? 'Please log in first.'
            : 'Your session has expired. Please log in again.'
          : DEFAULT_SERVER_ERROR
      toasterStore.danger({ text: errorMessage })
    } else {
      assertError(error)
      toasterStore.danger({ text: 'Please log in' })
    }
  }
})
</script>

<template>
  <div class="p-4 md:mt-8 md:p-2">
    <fwb-jumbotron
      class="bg-transparent"
      header-text="404 Not Found"
      sub-text="Sorry, we can't find this page."
    >
      <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
        <router-link to="/">
          <fwb-button outline>
            <template #prefix>
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  fill-rule="evenodd"
                />
              </svg>
            </template>
            Back to homepage
          </fwb-button>
        </router-link>
      </div>
    </fwb-jumbotron>
  </div>
</template>
