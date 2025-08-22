<script setup>
import { MaChart, MaIcon } from "@mobileaction/action-kit";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t, d } = useI18n();

const props = defineProps({
    dates: {
        type: Array,
        default: () => [],
    },
    pollutionData: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
    error: {
        type: Object,
        default: null,
    },
});

const airQualityMap = {
    GOOD: 1,
    SATISFACTORY: 2,
    MODERATE: 3,
    POOR: 4,
    SEVERE: 5,
    HAZARDOUS: 6,
};

const formattedDates = computed(() =>
    props.dates.map((date) => d(date, "short"))
);

const chartData = computed(() => {
    const dataByDate = props.pollutionData.reduce((acc, item) => {
        acc[item.date] = item.airQualityComponents;
        return acc;
    }, {});

    const o3Data = [];
    const coData = [];
    const so2Data = [];

    props.dates.forEach((date) => {
        const components = dataByDate[date];
        if (components) {
            o3Data.push(
                Number(components.O3) === 0
                    ? 0
                    : components.O3 in airQualityMap
                    ? airQualityMap[components.O3]
                    : null
            );
            coData.push(
                Number(components.CO) === 0
                    ? 0
                    : components.CO in airQualityMap
                    ? airQualityMap[components.CO]
                    : null
            );
            so2Data.push(
                Number(components.SO2) === 0
                    ? 0
                    : components.SO2 in airQualityMap
                    ? airQualityMap[components.SO2]
                    : null
            );
        } else {
            o3Data.push(null);
            coData.push(null);
            so2Data.push(null);
        }
    });

    const overallAirQuality = o3Data.map((o3, index) => {
        const co = coData[index];
        const so2 = so2Data[index];
        const values = [];
        if (o3 !== null) values.push(o3);
        if (co !== null) values.push(co);
        if (so2 !== null) values.push(so2);

        if (values.length === 0) {
            return null;
        }
        return Math.max(...values);
    });

    return {
        o3Data,
        coData,
        so2Data,
        overallAirQuality,
    };
});

const airQualityLevels = computed(() => [
    t("GOOD"),
    t("SATISFACTORY"),
    t("MODERATE"),
    t("POOR"),
    t("SEVERE"),
    t("HAZARDOUS"),
]);

const options = computed(() => {
    const data = chartData.value;

    // Color mapping for air quality levels
    const airQualityColors = [
        "#4CAF50",
        "#FFEB3B",
        "#FF9800",
        "#F44336",
        "#9C0D38",
        "#9C27B0",
    ];

    // Create data points with individual colors for the overall air quality line
    const overallAirQualityWithColors = data.overallAirQuality.map((value) => ({
        y: value,
        color: airQualityColors[value] || "#888888",
    }));

    return {
        xAxis: {
            categories: formattedDates.value,
            title: {
                text: t("date"),
            },
        },
        yAxis: {
            categories: [
                "",
                t("GOOD"),
                t("SATISFACTORY"),
                t("MODERATE"),
                t("POOR"),
                t("SEVERE"),
                t("HAZARDOUS"),
            ],
            title: {
                text: t("air_quality_level"),
            },
            min: 0,
            max: 6,
        },
        plotOptions: {
            column: {
                stacking: "normal",
            },
        },
        tooltip: {
            shared: true,
            formatter: function () {
                const date = this.category;

                let tooltip = `<b>${date}</b><br/>`;

                // Find the overall air quality level for this point
                const pointIndex = this.points[0]?.point?.index;
                if (
                    pointIndex !== undefined &&
                    data.overallAirQuality[pointIndex] !== undefined
                ) {
                    const overallLevel =
                        airQualityLevels.value[
                            data.overallAirQuality[pointIndex] - 1
                        ];
                    const overallColor =
                        airQualityColors[data.overallAirQuality[pointIndex]];
                    tooltip += `<span style="color:${overallColor}">●</span> <b>${t(
                        "overall_air_quality"
                    )}: ${overallLevel}</b><br/><br/>`;
                }

                this.points.forEach((point) => {
                    if (point.series.name !== t("overall_air_quality")) {
                        const level =
                            airQualityLevels.value[point.y - 1] || point.y;
                        tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${level}</b><br/>`;
                    }
                });

                return tooltip;
            },
        },
        series: [
            {
                type: "column",
                name: "O3",
                data: data.o3Data,
                color: "var(--ma-chart-color-app-rating-3)",
            },
            {
                type: "column",
                name: "CO",
                data: data.coData,
                color: "var(--ma-chart-color-app-rating-2)",
            },
            {
                type: "column",
                name: "SO2",
                data: data.so2Data,
                color: "var(--ma-chart-color-app-rating-1)",
            },
            {
                type: "line",
                name: t("overall_air_quality"),
                data: overallAirQualityWithColors,
                marker: {
                    enabled: true,
                    radius: 6,
                    lineWidth: 2,
                    lineColor: "#ffffff",
                },
                lineWidth: 3,
                color: "#666666", // Default line color
                showInLegend: true,
            },
        ],
    };
});
</script>

<template>
    <div
        v-if="loading"
        class="flex flex-col items-center justify-center w-full h-full rounded-lg min-h-96 px-16"
    >
        <MaIcon size="xl" name="loader" class="animate-spin" />
        <p class="text-lg font-semibold text-gray-600">Loading...</p>
    </div>
    <div
        v-else-if="error"
        class="flex flex-col items-center justify-center w-full h-full rounded-lg min-h-96 px-16"
    >
        <MaIcon size="xl" name="error" />
        <p class="text-lg font-semibold text-red-600">Error fetching data</p>
        <p class="text-gray-500">{{ error.message }}</p>
    </div>
    <div
        v-else-if="!props.dates || props.dates.length === 0"
        class="flex flex-col items-center justify-center w-full h-full rounded-lg min-h-96 px-16"
    >
        <MaIcon size="xl" name="404" />
        <p class="text-lg font-semibold text-gray-600">
            {{ t("no_data_to_display") }}
        </p>
        <p class="text-gray-500">
            {{ t("no_data_to_display_description") }}
        </p>
    </div>
    <MaChart v-else class="w-[90vw]" :options="options" />
</template>
