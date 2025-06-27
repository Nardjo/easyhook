---
trigger: glob
description: Apply Nuxt 3 standards for modern Vue development, focusing on consistent file structure (template, script, style), leveraging auto-imported composables, and avoiding redundant imports to keep code clean and maintainable.
globs: app/**/*.vue
---

## Nuxt Rules

### File Structure (Vue Files)

- Always structure your file in this order:
  ✅ `<template>` at the top  
  ✅ `<script>` in the middle  
  ✅ `<style>` at the bottom

```vue
<template>
  <!-- Markup -->
</template>

<script setup lang="ts">
  // Logic
</script>

<style scoped>
  /* Styles */
</style>

Imports - Do not import items that Nuxt auto-imports. Examples of auto-imported functions: - ref - computed -
definePageMeta - useRouter - useAsyncData ✅ Use them directly: const count = ref(0) const router = useRouter() ❌ Avoid
manual imports: import { ref } from 'vue' import { useRouter } from '#app'

### Props
When the variable name matches the prop name, always use Vue’s shorthand binding syntax.
✅ Correct : <UTable :data :columns />
❌ Incorrect <UTable :data="data" :columns="columns" />
If the prop name and the variable name are the same, you can omit the value and write only :propName. This makes the code cleaner and reduces duplication.

 

```
