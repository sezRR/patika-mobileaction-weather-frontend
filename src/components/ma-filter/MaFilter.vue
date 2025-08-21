<script setup>
import { MaTabButton2 } from "@mobileaction/action-kit";
import { computed } from "vue";

const props = defineProps({
    modelValue: { type: Boolean, default: false }, // ← drives active state
});
const emit = defineEmits(["update:modelValue"]);

// transparently proxy value ↔︎ v-model
const isActive = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
});
</script>

<template>
    <div
        class="[&>.ma-tab-button]:max-w-28 [&>.ma-tab-button]:w-28 [&>.ma-tab-button>.ma-ellipsis]:flex-1"
    >
        <MaTabButton2
            :isActive="isActive"
            type="rounded-dark"
            @click="isActive = !isActive"
        >
            <slot />
        </MaTabButton2>
    </div>
</template>
