---
trigger: model_decision
description: Apply Nuxt 3 standards for modern Vue development, focusing on consistent file structure (template, script, style), leveraging auto-imported composables, and avoiding redundant imports to keep code clean and maintainable.
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
```
