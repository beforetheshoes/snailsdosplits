<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          YNAB Vue 3 Quasar App
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Navigation
        </q-item-label>
        <ul>
          <li v-for="link in links" :key="link.linkname">
            <router-link :to="link.linklocation">
              {{ link.linkname }}
            </router-link>
          </li>
        </ul>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',


  setup () {
    const leftDrawerOpen = ref(false)
    const links = [
        {
          linkname: 'Budgets',
          linklocation: '/budgets'
        },
        {
          linkname: 'Categories',
          linklocation: '/categories',
        },
        {
          linkname: 'Transactions',
          linklocation: '/transactions'
        },
        {
          linkname: 'Step One',
          linklocation: '/step1'
        }
      ]
    return {
      leftDrawerOpen,
      links,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
