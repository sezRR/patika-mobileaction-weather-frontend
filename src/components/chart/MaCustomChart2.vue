<script setup>
import { MaChart } from "@mobileaction/action-kit";

const astConfig = {
    allowedAttributes: ["data-csv-name"],
};

const modulesToLoad = {
    sequential: ["exporting", "offline-exporting", "export-data"],
};

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
            name: '<div data-csv-name="rating: (5)">Rating 5</div>',
            data: [
                5, 1, 5, 0, 0, 5, 5, 5, 5, 2, 0, 2, 4, 5, 5, 3, 4, 3, 2, 5, 3,
                0, 0, 3, 4, 3, 3, 1, 5, 1, 0,
            ],
            color: "var(--ma-chart-color-app-rating-5)",
        },
        {
            type: "column",
            name: '<div data-csv-name="rating: (4)">Rating 4</div>',
            data: [
                1, 2, 0, 1, 3, 5, 5, 1, 5, 3, 2, 1, 2, 2, 0, 3, 4, 1, 0, 2, 3,
                5, 4, 5, 4, 3, 0, 3, 0, 3, 2,
            ],
            color: "var(--ma-chart-color-app-rating-4)",
        },
        {
            type: "column",
            name: '<div data-csv-name="rating: (3)">Rating 3</div>',
            data: [
                4, 3, 0, 1, 5, 4, 4, 4, 5, 5, 5, 3, 1, 0, 4, 1, 2, 4, 4, 5, 1,
                0, 0, 0, 3, 3, 4, 0, 2, 1, 4,
            ],
            color: "var(--ma-chart-color-app-rating-3)",
        },
        {
            type: "column",
            name: '<div data-csv-name="rating: (2)">Rating 2</div>',
            data: [
                5, 2, 4, 1, 4, 0, 5, 3, 3, 0, 0, 2, 1, 1, 0, 3, 0, 5, 4, 2, 0,
                3, 4, 0, 1, 5, 1, 4, 5, 1, 0,
            ],
            color: "var(--ma-chart-color-app-rating-2)",
        },
        {
            type: "column",
            name: '<div data-csv-name="rating: (1)">Rating 1</div>',
            data: [
                3, 1, 4, 5, 4, 0, 4, 3, 0, 0, 4, 5, 0, 1, 5, 4, 5, 4, 5, 3, 5,
                2, 4, 3, 0, 2, 2, 3, 5, 0, 2,
            ],
            color: "var(--ma-chart-color-app-rating-1)",
        },
    ],
};
</script>

<template>
    <MaChart
        class="w-[64rem]"
        :astConfig="astConfig"
        :modulesToLoad="modulesToLoad"
        :options="options"
    />
</template>
