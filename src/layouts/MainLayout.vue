<template>
    <q-layout view="lHh lpr lFf">
      <q-footer bordered class="bg-deep-purple-9 text-white">
        <q-tabs  
            active-color="white" 
            indicator-color="transparent" 
            class="text-grey"
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

export default {
  name: 'MainLayout',


  setup () {
  }
}
</script>
