<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
    selectedCount: {
        type: Number,
        default: 0,
    },
    currentPage: {
        type: Number,
        default: 0,
    },
    totalPages: {
        type: Number,
        default: 1,
    },
    totalItems: {
        type: Number,
        default: 0,
    },
    isAllSelected: {
        type: Boolean,
        default: false,
    },
    isAllDeselected: {
        type: Boolean,
        default: true,
    },
    isCurrentPageAllSelected: {
        type: Boolean,
        default: false,
    },
    isCurrentPageAllDeselected: {
        type: Boolean,
        default: true,
    },
});

defineEmits([
    "select-all",
    "select-current-page",
    "remove-all",
    "remove-current-page",
    "select-one-week",
    "select-one-month",
    "select-one-year",
]);

// Check if week and month selections are available
const isWeekAvailable = computed(() => props.totalItems >= 7);
const isMonthAvailable = computed(() => props.totalItems >= 30);
const isYearAvailable = computed(() => props.totalItems >= 365);
</script>

<template>
    <div class="flex gap-2 justify-between items-center">
        <div class="flex gap-2 text-xs text-stone-500">
            <button
                class="hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                :disabled="isAllSelected"
                @click="$emit('select-all')"
            >
                {{ t("select_all") }}
            </button>
            <template v-if="totalPages > 1">
                <span>·</span>
                <button
                    class="hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                    :disabled="isCurrentPageAllSelected"
                    @click="$emit('select-current-page')"
                >
                    {{ t("select_current_page") }}
                </button>
            </template>
            <span>·</span>
            <button
                class="hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                :disabled="isAllDeselected"
                @click="$emit('remove-all')"
            >
                {{ t("remove_all") }}
            </button>
            <template v-if="totalPages > 1">
                <span>·</span>
                <button
                    class="hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
                    :disabled="isCurrentPageAllDeselected"
                    @click="$emit('remove-current-page')"
                >
                    {{ t("remove_current_page") }}
                </button>
            </template>

            <!-- More actions section -->
            <template
                v-if="isWeekAvailable || isMonthAvailable || isYearAvailable"
            >
                <span>·</span>
                <span class="text-stone-400"
                    >{{ t("from_current_position") }}:</span
                >
                <button
                    v-if="isWeekAvailable"
                    class="hover:underline"
                    @click="$emit('select-one-week')"
                >
                    {{ t("one_week") }}
                </button>
                <button
                    v-if="isMonthAvailable"
                    class="hover:underline"
                    @click="$emit('select-one-month')"
                >
                    {{ t("one_month") }}
                </button>
                <button
                    v-if="isYearAvailable"
                    class="hover:underline"
                    @click="$emit('select-one-year')"
                >
                    {{ t("one_year") }}
                </button>
            </template>

            <span v-if="selectedCount" class="ml-1 italic">
                {{ selectedCount }} {{ t("selected") }}
            </span>
        </div>

        <span class="text-stone-400 text-xs select-none">
            {{ currentPage + 1 }} / {{ Math.max(1, totalPages) }}
        </span>
    </div>
</template>
