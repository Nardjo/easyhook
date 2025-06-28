<template>
  <UserMenuDropdown :menu-items="menuItems" :button-props="buttonProps" :collapsed="collapsed" />
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  import { useAppConfig, useColorMode } from '#imports'
  import type { DropdownMenuItem } from '@nuxt/ui'
  import UserMenuDropdown from './UserMenuDropdown.vue'

  const props = defineProps<{ collapsed?: boolean }>()

  const colorMode = useColorMode()
  const appConfig = useAppConfig()
  const router = useRouter()
  const avatarSrc = ref<string | undefined>(undefined)
  const userStore = useUserStore()

  const userFullName = computed((): string => {
    if (userStore.firstName || userStore.lastName) {
      return `${userStore.firstName ?? ''} ${userStore.lastName ?? ''}`.trim()
    }
    return ''
  })

  const buttonProps = computed<Record<string, unknown>>(() => ({
    label: !props.collapsed ? userFullName.value : undefined,
    trailingIcon: !props.collapsed ? 'i-lucide-chevrons-up-down' : undefined,
    avatar: avatarSrc.value ? { src: avatarSrc.value, alt: userFullName.value } : undefined,
  }))

  const colors = [
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
  ] as const

  const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone'] as const

  const menuItems = computed<DropdownMenuItem[][]>(() => [
    [
      {
        label: userFullName.value,
        avatar: avatarSrc.value ? { src: avatarSrc.value, alt: userFullName.value } : undefined,
      },
    ],
    [
      {
        label: 'Profile',
        icon: 'i-lucide-user',
      },
      {
        label: 'Billing',
        icon: 'i-lucide-credit-card',
      },
      {
        label: 'Settings',
        icon: 'i-lucide-settings',
        to: '/settings',
      },
    ],
    [
      {
        label: 'Theme',
        icon: 'i-lucide-palette',
        children: [
          {
            label: 'Primary',
            slot: 'chip',
            chip: appConfig.ui.colors.primary,
            content: {
              align: 'center',
              collisionPadding: 16,
            },
            children: colors.map(color => ({
              label: color,
              chip: color,
              slot: 'chip',
              checked: appConfig.ui.colors.primary === color,
              type: 'checkbox',
              onSelect: e => {
                e.preventDefault()

                appConfig.ui.colors.primary = color
              },
            })),
          },
          {
            label: 'Neutral',
            slot: 'chip',
            chip: appConfig.ui.colors.neutral === 'neutral' ? 'old-neutral' : appConfig.ui.colors.neutral,
            content: {
              align: 'end',
              collisionPadding: 16,
            },
            children: neutrals.map(color => ({
              label: color,
              chip: color === 'neutral' ? 'old-neutral' : color,
              slot: 'chip',
              type: 'checkbox',
              checked: appConfig.ui.colors.neutral === color,
              onSelect: e => {
                e.preventDefault()

                appConfig.ui.colors.neutral = color
              },
            })),
          },
        ],
      },
      {
        label: 'Appearance',
        icon: 'i-lucide-sun-moon',
        children: [
          {
            label: 'Light',
            icon: 'i-lucide-sun',
            type: 'checkbox',
            checked: colorMode.value === 'light',
            onSelect(e: Event) {
              e.preventDefault()

              colorMode.preference = 'light'
            },
          },
          {
            label: 'Dark',
            icon: 'i-lucide-moon',
            type: 'checkbox',
            checked: colorMode.value === 'dark',
            onUpdateChecked(checked: boolean) {
              if (checked) {
                colorMode.preference = 'dark'
              }
            },
            onSelect(e: Event) {
              e.preventDefault()
            },
          },
        ],
      },
    ],
    [
      {
        label: 'Templates',
        icon: 'i-lucide-layout-template',
        children: [
          {
            label: 'Starter',
            to: 'https://ui-pro-starter.nuxt.dev/',
          },
          {
            label: 'Landing',
            to: 'https://landing-template.nuxt.dev/',
          },
          {
            label: 'Docs',
            to: 'https://docs-template.nuxt.dev/',
          },
          {
            label: 'SaaS',
            to: 'https://saas-template.nuxt.dev/',
          },
          {
            label: 'Dashboard',
            to: 'https://dashboard-template.nuxt.dev/',
            checked: true,
            type: 'checkbox',
          },
          {
            label: 'Chat',
            to: 'https://chat-template.nuxt.dev/',
          },
        ],
      },
    ],
    [
      {
        label: 'Documentation',
        icon: 'i-lucide-book-open',
        to: 'https://ui.nuxt.com/getting-started/installation/pro/nuxt',
        target: '_blank',
      },
      {
        label: 'GitHub repository',
        icon: 'i-simple-icons-github',
        to: 'https://github.com/nuxt-ui-pro/dashboard',
        target: '_blank',
      },
      {
        label: 'Upgrade to Pro',
        icon: 'i-lucide-rocket',
        to: 'https://ui.nuxt.com/pro/purchase',
        target: '_blank',
      },
    ],
    [
      {
        label: 'Log out',
        icon: 'i-lucide-log-out',
        async onSelect() {
          await fetch('/api/logout', { method: 'POST', credentials: 'include' })
          userStoreRefs.clearUser()
          router.push('/login')
        },
      },
    ],
  ])
</script>
