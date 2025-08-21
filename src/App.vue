<script setup>
import { MaDatePicker2 } from "@mobileaction/action-kit";
import dayjs from "dayjs";
import { ref, computed } from "vue";

import MaBackendStatusBadge from "./components/MaBackendStatusBadge.vue";
import MaFilter from "./components/ma-filter/MaFilter.vue";
import MaFilterContainer from "./components/ma-filter/MaFilterContainer.vue";

const dateRange = ref([
    dayjs().subtract(1, "week").format("YYYY-MM-DD"),
    dayjs().subtract(1, "day").format("YYYY-MM-DD"),
]);

/* --- build an array of all dates between start & end (inclusive) --- */
const daysInRange = computed(() => {
    if (dateRange.value.length !== 2) return [];

    const [startStr, endStr] = dateRange.value;
    const start = dayjs(startStr);
    const end = dayjs(endStr);

    const days = [];
    for (let d = end; !d.isBefore(start); d = d.subtract(1, "day")) {
        days.push(d.format("YYYY-MM-DD"));
    }

    return days;
});
</script>

<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center gap-4 px-6"
    >
        <div
            class="flex flex-col px-8 justify-between items-center gap-4 h-screen py-4"
        >
            <div class="flex flex-col gap-2">
                <MaBackendStatusBadge :isOnline="true" />
                <div class="flex flex-col gap-1">
                    <MaDatePicker2
                        v-model="dateRange"
                        :range="true"
                        :multiCalendars="true"
                        placeholder="Start Date – End Date"
                    />
                </div>
            </div>
            <MaFilterContainer>
                <MaFilter v-for="day in daysInRange" :key="day" :date="day">
                    {{ day }}
                </MaFilter>
            </MaFilterContainer>
        </div>
    </div>
</template>
