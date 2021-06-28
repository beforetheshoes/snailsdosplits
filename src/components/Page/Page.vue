<template>
    <div class="page absolute-top fit bg-secondary col-auto">
        <slot />
        
        <router-view v-slot="{ Component }">
            <transition 
                appear
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight"
            >
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<script>
export default {
   name: 'Page' 
}
</script>
