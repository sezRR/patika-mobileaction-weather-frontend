<script setup>
import { computed } from "vue";

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
});

defineEmits([
    "select-all",
    "select-current-page",
    "remove-all",
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
            <button class="hover:underline" @click="$emit('select-all')">
                Select all
            </button>
            <template v-if="totalPages > 1">
                <span>·</span>
                <button
                    class="hover:underline"
                    @click="$emit('select-current-page')"
                >
                    Select current page
                </button>
            </template>
            <span>·</span>
            <button class="hover:underline" @click="$emit('remove-all')">
                Remove all
            </button>

            <!-- More actions section -->
            <template
                v-if="isWeekAvailable || isMonthAvailable || isYearAvailable"
            >
                <span>·</span>
                <span class="text-stone-400">From current position:</span>
                <button
                    v-if="isWeekAvailable"
                    class="hover:underline"
                    @click="$emit('select-one-week')"
                >
                    +1 week
                </button>
                <button
                    v-if="isMonthAvailable"
                    class="hover:underline"
                    @click="$emit('select-one-month')"
                >
                    +1 month
                </button>
                <button
                    v-if="isYearAvailable"
                    class="hover:underline"
                    @click="$emit('select-one-year')"
                >
                    +1 year
                </button>
            </template>

            <span v-if="selectedCount" class="ml-1 italic">
                {{ selectedCount }} selected
            </span>
        </div>

        <span v-if="totalPages > 1" class="text-stone-400 text-xs select-none">
            {{ currentPage + 1 }} / {{ totalPages }}
        </span>
    </div>
</template>
