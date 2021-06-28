<template>
    <header 
        class="page-header q-header q-layout__section--marginal fixed-top q-header--bordered absolute-top bg-primary text-white">
        <div class="q-toolbar row no-wrap items-center">
            <div class="q-toolbar__title ellipsis text-center text-body1">
                <slot name="title" />
                <q-icon :name="mdiSnail" />
            </div>
        </div>
    </header>
</template>

<script>
import { mdiSnail } from '@quasar/extras/mdi-v5';

export default {
    name: 'PageHeader',

    setup() {
       return {
           mdiSnail
       }
   }
}
</script>
