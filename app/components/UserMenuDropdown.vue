<template>
  <UDropdownMenu
    :items="menuItems"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="buttonProps"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :ui="{ trailingIcon: 'text-dimmed' }"
    />
    <template #chip-leading="{ item }">
      <span
        :style="{
          '--chip-light': `var(--color-${item.chip}-500)`,
          '--chip-dark': `var(--color-${item.chip}-400)`
        }"
        class="ms-0.5 size-2 rounded-full bg-(--chip-light) dark:bg-(--chip-dark)"
      />
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { PropType } from 'vue'

defineProps({
  menuItems: {
    type: Array as PropType<DropdownMenuItem[][]>,
    required: true
  },
  buttonProps: {
    type: Object as PropType<Record<string, unknown>>,
    required: true
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})
</script>
