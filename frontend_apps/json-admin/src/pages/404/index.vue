<template>
  <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
    <div className="text-center">
      <p className="text-base font-semibold text-indigo-600">404</p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        <!-- Page not found -->
        {{ t('404.title') }}
      </h1>
      <p className="mt-6 text-base leading-7 text-gray-600">
        <!-- Sorry, we couldn’t find the page you’re looking for. -->
        {{ t('404.subTitle') }}
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a href="/"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <!-- Go back home -->
          {{ t('btn.backHome') }}
        </a>
        <!-- <a href="#" className="text-sm font-semibold text-gray-900">
          Contact support <span aria-hidden="true">&rarr;</span>
        </a> -->
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
