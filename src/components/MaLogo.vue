<script setup>
import { createPlacementClass } from "@/utils/placement-util";
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

const placement = computed(() => createPlacementClass(props.placement));
</script>

<template>
    <img
        class="absolute w-36 p-4"
        :src="props.src"
        :alt="props.alt"
        :class="[placement, props.class]"
    />
</template>
