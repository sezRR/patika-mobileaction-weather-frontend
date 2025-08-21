<script setup>
import { MaRadioCard } from "@mobileaction/action-kit";

const props = defineProps({
    city: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    map: {
        type: String,
        required: true,
    },
    alt: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <MaRadioCard :value="props.value" :hint="props.country" :text="props.city">
        <template #suffix>
            <img
                :src="props.map"
                :alt="props.alt"
                class="w-28 absolute top-1/2 right-[5%] translate-x-1/4 -translate-y-1/2"
            />
        </template>
    </MaRadioCard>
</template>

<style scoped>
::v-deep(.ma-radio-text-content) {
    padding-top: 0.75rem !important;
    margin-left: 0.5rem !important;
}

::v-deep(.ma-radio) {
    height: 4rem;
    gap: 0rem;
}
</style>
