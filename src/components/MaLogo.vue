<script setup>
import { computed } from "vue";

const props = defineProps({
    src: {
        type: String,
        required: true,
    },
    alt: {
        type: String,
        required: true,
    },
    placement: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        default: "",
    },
});

const placement = computed(() => {
    if (props.placement === "top-left") {
        return "top-0 left-0";
    } else if (props.placement === "top-right") {
        return "top-0 right-0";
    } else if (props.placement === "bottom-left") {
        return "bottom-0 left-0";
    } else if (props.placement === "bottom-right") {
        return "bottom-0 right-0";
    }
    return "";
});
</script>

<template>
    <img
        class="absolute w-36 p-4"
        :src="props.src"
        :alt="props.alt"
        :class="[placement, props.class]"
    />
</template>
