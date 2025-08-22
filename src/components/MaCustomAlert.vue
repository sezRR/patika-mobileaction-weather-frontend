<script setup lang="ts">
import { MaAlert } from "@mobileaction/action-kit";

defineProps({
    message: {
        type: String,
        default: "Insert your message here!",
    },
    title: {
        type: String,
        default: "Info",
    },
    type: {
        type: String,
        default: "info",
    },
    variant: {
        type: String,
        default: "light",
    },
});
</script>

<template>
    <MaAlert
        :message="message"
        :title="title"
        :type="type"
        :variant="variant"
        :closable="false"
    />
</template>
