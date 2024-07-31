<script setup lang="ts">
import { FwbButton } from 'flowbite-vue'
import { RouterLink } from 'vue-router'
import { ref, type Ref } from 'vue'

import plusPng from '@/assets/plus.png'
import * as localStorage from '@/utils/storage'
import useAuthStore from '@/stores/auth'

const authStore = useAuthStore()
const { isLoggedIn } = authStore

const theme: Ref<string> = ref(localStorage.getItem('color-theme') ?? 'light')

function handleClickTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('color-theme', theme.value)

  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}
</script>

<template>
  <nav class="bg-white border-gray-200 dark:bg-gray-900 max-w-3xl w-full">
    <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
      <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="https://flowbite.com/docs/images/logo.svg" class="h-10" alt="Flowbite Logo" />
      </router-link>

      <div id="navbar-default">
        <ul
          class="font-medium rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 flex items-center"
        >
          <li class="mx-2">
            <button
              type="button"
              @click="handleClickTheme"
              class="text-gray-500 inline-flex items-center justify-center dark:text-gray-400 hover:bg-gray-100 w-10 h-10 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
            >
              <svg
                class="w-4 h-4"
                :class="{ hidden: theme === 'dark' }"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 20"
              >
                <path
                  d="M17.8 13.75a1 1 0 0 0-.859-.5A7.488 7.488 0 0 1 10.52 2a1 1 0 0 0 0-.969A1.035 1.035 0 0 0 9.687.5h-.113a9.5 9.5 0 1 0 8.222 14.247 1 1 0 0 0 .004-.997Z"
                ></path>
              </svg>
              <svg
                class="w-4 h-4"
                :class="{ hidden: theme === 'light' }"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-11a1 1 0 0 0 1-1V1a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1Zm0 12a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM4.343 5.757a1 1 0 0 0 1.414-1.414L4.343 2.929a1 1 0 0 0-1.414 1.414l1.414 1.414Zm11.314 8.486a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM4 10a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm15-1h-2a1 1 0 1 0 0 2h2a1 1 0 0 0 0-2ZM4.343 14.243l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414a1 1 0 0 0-1.414-1.414ZM14.95 6.05a1 1 0 0 0 .707-.293l1.414-1.414a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 .707 1.707Z"
                ></path>
              </svg>
              <span class="sr-only">Toggle dark mode</span>
            </button>
          </li>
          <li>
            <router-link to="/create-card-set">
              <fwb-button color="default" pill square>
                <img :src="plusPng" alt="" />
              </fwb-button>
            </router-link>
          </li>
          <div v-if="!isLoggedIn" class="flex px-4 gap-2">
            <li>
              <router-link to="login">
                <fwb-button color="alternative">Log in</fwb-button>
              </router-link>
            </li>
            <li>
              <router-link to="login">
                <fwb-button gradient="cyan-blue">Sign up</fwb-button>
              </router-link>
            </li>
          </div>
          <div v-else>
            <li class="ml-4">
              <router-link to="login">
                <fwb-button gradient="purple-blue">Log out</fwb-button>
              </router-link>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </nav>
</template>
