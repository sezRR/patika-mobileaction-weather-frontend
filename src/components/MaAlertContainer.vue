<script setup>
import { useAlerts } from "@/composables/useAlerts";
import MaCustomAlert from "./MaCustomAlert.vue";

const { alerts } = useAlerts();
</script>

<template>
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <transition-group name="fade">
            <MaCustomAlert
                v-for="alert in alerts"
                :key="alert.id"
                :title="alert.title"
                :message="alert.message"
                :type="alert.type"
                :variant="alert.variant"
            />
        </transition-group>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
