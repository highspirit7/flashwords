<script setup lang="ts">
import { FwbButton } from 'flowbite-vue'
import plusPng from '@/assets/plus.png'
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900 max-w-3xl w-full">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="https://flowbite.com/docs/images/logo.svg" class="h-10" alt="Flowbite Logo" />
      </router-link>

      <div class="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul
          class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <router-link to="/create-card-set">
              <fwb-button color="default" pill square>
                <img :src="plusPng" alt="" />
              </fwb-button>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
