<script setup>
import { MaBadge } from "@mobileaction/action-kit";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
    isOnline: {
        type: Boolean,
        default: false,
    },
});

const badgeVariant = computed(() => (props.isOnline ? "green" : "red"));

const badgeText = computed(() =>
    props.isOnline ? t("backend_online") : t("backend_offline")
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
