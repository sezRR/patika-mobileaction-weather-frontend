<script setup>
import { MaChart } from "@mobileaction/action-kit";

const options = {
    plotOptions: {
        column: {
            stacking: "normal",
        },
    },
    tooltip: {
        shared: true,
    },
    series: [
        {
            type: "column",
            name: "O₃",
            data: [
                1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2, 1,
                2, 3, 2, 1, 2, 3, 2, 1, 2, 3,
            ],
            color: "var(--ma-chart-color-app-rating-3)",
        },
        {
            type: "column",
            name: "CO",
            data: [
                3, 4, 2, 1, 3, 3, 2, 4, 1, 3, 3, 2, 1, 4, 3, 2, 1, 3, 3, 2, 4,
                1, 3, 3, 2, 1, 4, 3, 2, 1, 3,
            ],
            color: "var(--ma-chart-color-app-rating-2)",
        },
        {
            type: "column",
            name: "SO₂",
            data: [
                2, 3, 1, 0, 2, 4, 5, 1, 0, 2, 3, 1, 2, 2, 3, 1, 0, 2, 1, 4, 3,
                2, 1, 0, 2, 3, 1, 2, 2, 1, 0,
            ],
            color: "var(--ma-chart-color-app-rating-1)",
        },
    ],
};
</script>

<template>
    <MaChart class="w-[64rem]" :options="options" />
</template>
