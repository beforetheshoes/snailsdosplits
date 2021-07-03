<template>

    <q-layout view="lHh lpr lFf" :style="desktopStyle" :class="desktopClass">
      <q-footer bordered class="bg-deep-purple-9 text-white" :class="desktopClass" :style="desktopStyle">
        <q-tabs  
            active-color="grey" 
            indicator-color="transparent" 
            class="white"
            mobile-arrows
        >
          <q-route-tab 
                to="/home"
                label="Home"
                icon="las la-home" 
          />
        </q-tabs>
      </q-footer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
</template>

<script>
import { useQuasar } from 'quasar'
import { computed } from 'vue'

export default {
  name: 'MainLayout',


  setup () {
    const $q = useQuasar()

    const desktopClass = computed(() => {
      if ($q.platform.is.desktop) {
        return "q-mx-auto"
      } else {
        return null
      }
    })

    const desktopStyle = computed(() => {
      if ($q.platform.is.desktop) {
        return "max-width:1000px"
      } else {
        return null
      }
    })

    return {
      desktopClass,
      desktopStyle
    }
  }
}
</script>
