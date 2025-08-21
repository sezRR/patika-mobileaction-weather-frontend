<script setup>
import { computed, useSlots, h } from "vue";

const slots = useSlots();

const renderedChildren = computed(() => {
    const children = slots.default?.() ?? [];

    // If no slots provided, render plain text as a VNode
    if (children.length === 0) {
        return [h("span", "Label")];
    }

    return children;
});
</script>

<template>
    <span class="text-stone-400 text-xs">
        <component
            v-for="(child, index) in renderedChildren"
            :key="index"
            :is="child"
        />
    </span>
</template>
