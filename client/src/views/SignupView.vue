<script setup lang="ts">
import { FwbHeading, FwbButton, FwbInput } from 'flowbite-vue'
import { ref, watch } from 'vue'
import { z } from 'zod'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { publicTrpc } from '@/trpc'
import { useToasterStore } from '@/stores/toaster'
import { assertError } from '@/utils/errors'
import { TRPCClientError } from '@trpc/client'
import { DEFAULT_SERVER_ERROR } from '@/consts'

const router = useRouter()
const signupUserSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(64, 'Password must be at most 64 characters long')
    .regex(/[A-Z]/, {
      message: 'Password must include at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must include at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must include at least one number' }),
  username: z
    .string()
    .min(4, 'Username must be at least 4 characters long')
    .max(24, 'Username must be at most 24 characters long'),
})
type SignupUser = z.infer<typeof signupUserSchema>
const signupForm: Ref<SignupUser> = ref({
  username: '',
  email: '',
  password: '',
})
const errorMessages = ref({
  email: '',
  username: '',
  password: '',
})
const signupErrorMessage = ref('')
const toasterStore = useToasterStore()

function handleZodIssue(issues: z.ZodIssue[], fieldName: keyof SignupUser) {
  const filteredIssues = issues.filter(issue => issue.path[0] == fieldName)

  errorMessages.value[fieldName] = filteredIssues.length > 0 ? filteredIssues[0].message : ''
}

watch(
  () => signupForm,
  newSignupForm => {
    const { error } = signupUserSchema.safeParse(newSignupForm.value)
    const signupUserKeys = Object.keys(signupUserSchema.shape) as (keyof SignupUser)[]

    if (error) {
      signupUserKeys.forEach(field => {
        if (signupForm.value[field]) {
          handleZodIssue(error.issues, field)
        }
      })
    } else {
      errorMessages.value = {
        email: '',
        username: '',
        password: '',
      }
    }
  },
  { deep: true },
)

async function onClickSignup() {
  try {
    await publicTrpc.user.signup.mutate(signupForm.value)
    toasterStore.success({ text: 'Successfully signed up!', timeout: 2000 })
    router.replace('/login')
  } catch (error: unknown) {
    if (error instanceof TRPCClientError) {
      if (error.data?.httpStatus === 400) signupErrorMessage.value = error.message
      else signupErrorMessage.value = DEFAULT_SERVER_ERROR
    } else {
      assertError(error)
      signupErrorMessage.value = error.message
    }
  }
}
</script>
<template>
  <div class="h-full p-4 md:p-2 flex justify-center items-center">
    <form class="w-full max-w-md md:mx-auto my-8 mx-2 md:my-4" @submit.prevent="onClickSignup">
      <fwb-heading tag="h2" class="text-center my-4">Sign up</fwb-heading>
      <div class="mb-5">
        <fwb-input
          v-model="signupForm.email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          class="mb-1"
          :class="{ error: errorMessages.email !== '' }"
        />
        <p v-show="errorMessages.email !== ''" class="text-red-700 dark:text-red-500 text-sm px-1">
          {{ errorMessages.email }}
        </p>
      </div>
      <div class="mb-5">
        <fwb-input
          v-model="signupForm.username"
          label="Username"
          type="text"
          placeholder="sunshine2000"
          class="mb-1"
          :class="{ error: errorMessages.username !== '' }"
        />
        <p
          v-show="errorMessages.username !== ''"
          class="text-red-700 dark:text-red-500 text-sm px-1"
        >
          {{ errorMessages.username }}
        </p>
      </div>
      <div
        :class="{ 'mb-5': errorMessages.password === '', 'mb-2': errorMessages.password !== '' }"
      >
        <fwb-input
          v-model="signupForm.password"
          label="Password"
          placeholder="Enter your password"
          class="mb-1"
          :class="{ error: errorMessages.password !== '' }"
        />
        <p
          v-show="errorMessages.password !== ''"
          class="text-red-700 dark:text-red-500 text-sm px-1"
        >
          {{ errorMessages.password }}
        </p>
      </div>
      <div
        data-testid="signupErrorMessage"
        v-show="signupErrorMessage !== ''"
        class="my-4 w-full font-semibold p-4 border-2 rounded-md border-red-500 text-red-500"
      >
        {{ signupErrorMessage }}
      </div>
      <div class="flex justify-center items-center">
        <fwb-button size="lg" gradient="blue">Sign up</fwb-button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.error :deep(input) {
  @apply bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500;
}

.error :deep(label) {
  @apply text-red-700 dark:text-red-500;
}
</style>
