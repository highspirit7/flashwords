<script setup lang="ts">
import { useToasterStore } from '@/stores/toaster'
import { FwbAlert } from 'flowbite-vue'

// TODO : no need to use global store for this toast
const toatserStore = useToasterStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toatserStore.toasts.length" class="toaster-wrapper">
        <TransitionGroup name="toast" tag="ul">
          <li v-for="toast in toatserStore.toasts" class="toaster-inner" :key="toast.id">
            <fwb-alert icon :type="toast.status">
              {{ toast.text }}
            </fwb-alert>
          </li>
        </TransitionGroup>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: 0.25s ease all;
}

.toaster-wrapper {
  @apply fixed top-4 right-1/2 translate-x-2/4;

  z-index: 100;

  @media screen and (width < 768px) {
    width: 100%;
    max-width: 88%;
  }

  .toaster-inner {
    @apply mb-2;
  }
}
</style>
