<script setup lang="ts">
import { FwbHeading, FwbButton, FwbInput, FwbTextarea } from 'flowbite-vue'
import { ref } from 'vue'
import PlusDarkSvg from '@/assets/plus-dark.svg'

const loading = ref(false)
</script>

<template>
  <div class="mt-8 p-2">
    <div class="flex justify-between">
      <fwb-heading tag="h1">Create a new card set</fwb-heading>
      <fwb-button size="md" :disabled="loading" :loading="loading">Create</fwb-button>
    </div>
    <div class="my-8">
      <fwb-input
        v-model="name"
        label="Title"
        placeholder="Enter a title for this cards set"
        required
        class="mb-2"
      />
      <fwb-textarea
        v-model="message"
        :rows="4"
        label="Description"
        placeholder="Add a description"
        class="resize-none"
      />
    </div>
    <ul>
      <li class="bg-white p-4 rounded-lg">
        <fwb-heading tag="h5">1</fwb-heading>
        <hr class="mb-2" />
        <div class="grid grid-cols-2 gap-4">
          <fwb-input v-model="name" label="Term" required class="w-full" />
          <fwb-input v-model="name" label="Definition" required class="w-full" />
        </div>
      </li>
    </ul>
    <div class="flex justify-center p-4 my-4 bg-white rounded-lg">
      <fwb-button color="light" pill>
        Add a card
        <template #suffix>
          <!-- <svg
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
          </svg> -->
          <PlusDarkSvg />
        </template>
      </fwb-button>
    </div>
  </div>
</template>

<style scoped></style>
