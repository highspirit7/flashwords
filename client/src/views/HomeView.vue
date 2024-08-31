<script setup lang="ts">
import { FwbJumbotron, FwbButton } from 'flowbite-vue'
import { onBeforeMount } from 'vue'

onBeforeMount(async () => {})
</script>

<template>
  <div class="p-4 md:mt-8 md:p-2">
    <fwb-jumbotron
      class="bg-transparent"
      header-text="Welcome to Flashwords"
      sub-text="Create your own flashcards and master new terms with ease. Add examples of the new terms so that you can learn them more efficiently"
    >
      <div class="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
        <router-link to="signup">
          <fwb-button gradient="cyan-blue" size="xl">Sign up now</fwb-button>
        </router-link>
      </div>
    </fwb-jumbotron>
  </div>
</template>
