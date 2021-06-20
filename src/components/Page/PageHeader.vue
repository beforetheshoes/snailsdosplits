<template>
    <header 
        class="page-header q-header q-layout__section--marginal fixed-top q-header--bordered absolute-top bg-white text-primary">
        <div class="q-toolbar row no-wrap items-center">
            <div class="q-toolbar__title ellipsis text-center text-body1">
                <slot name="title" />
            </div>
        </div>
    </header>
</template>

<script>
export default {
   name: 'PageHeader' 
}
</script>
