<script setup>
import { MaBadge } from "@mobileaction/action-kit";
import { computed } from "vue";

const props = defineProps({
    isOnline: {
        type: Boolean,
        default: false,
    },
});

const badgeVariant = computed(() => (props.isOnline ? "green" : "red"));

const badgeText = computed(() =>
    props.isOnline ? "Backend is Online" : "Backend is Offline"
);
</script>

<template>
    <div>
        <MaBadge
            shape="square"
            :variant="badgeVariant"
            type="secondary"
            size="medium"
            class="flex justify-center items-center"
        >
            <MaBadge shape="dot" :variant="badgeVariant" />
            {{ badgeText }}
        </MaBadge>
    </div>
</template>
