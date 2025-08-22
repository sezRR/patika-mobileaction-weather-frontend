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
});

const formattedDates = computed(() =>
    props.dates.map((date) => d(date, "short"))
);

// Generate sample data based on the number of dates
const generateSampleData = (length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 5));
};

// Generate data for all pollutants and calculate overall air quality
const generateChartData = (length) => {
    const o3Data = generateSampleData(length);
    const coData = generateSampleData(length);
    const so2Data = generateSampleData(length);

    // Calculate overall air quality level as the maximum of all pollutants
    const overallAirQuality = o3Data.map((o3, index) => {
        return Math.max(o3, coData[index], so2Data[index]);
    });

    return {
        o3Data,
        coData,
        so2Data,
        overallAirQuality,
    };
};

const airQualityLevels = computed(() => [
    t("GOOD"),
    t("SATISFACTORY"),
    t("MODERATE"),
    t("POOR"),
    t("SEVERE"),
    t("HAZARDOUS"),
]);

const options = computed(() => {
    const dataLength = props.dates.length || 31;
    const chartData = generateChartData(dataLength);

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
    const overallAirQualityWithColors = chartData.overallAirQuality.map(
        (value, index) => ({
            y: value,
            color: airQualityColors[value] || "#888888",
        })
    );

    return {
        xAxis: {
            categories: props.dates.length
                ? formattedDates.value
                : Array.from({ length: dataLength }, (_, i) => `Day ${i + 1}`),
            title: {
                text: t("date"),
            },
        },
        yAxis: {
            categories: airQualityLevels.value,
            title: {
                text: t("air_quality_level"),
            },
            labels: {
                formatter: function () {
                    return airQualityLevels.value[this.value] || this.value;
                },
            },
            max: 4, // Limit to 0-4 (a-e)
            min: 0,
        },
        plotOptions: {
            column: {
                stacking: "normal",
                pointPadding: 0.1,
                borderWidth: 0,
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
                    chartData.overallAirQuality[pointIndex] !== undefined
                ) {
                    const overallLevel =
                        airQualityLevels.value[
                            chartData.overallAirQuality[pointIndex]
                        ];
                    const overallColor =
                        airQualityColors[
                            chartData.overallAirQuality[pointIndex]
                        ];
                    tooltip += `<span style="color:${overallColor}">●</span> <b>${t(
                        "overall_air_quality"
                    )}: ${overallLevel}</b><br/><br/>`;
                }

                this.points.forEach((point) => {
                    if (point.series.name !== t("overall_air_quality")) {
                        const level =
                            airQualityLevels.value[point.y] || point.y;
                        tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${level}</b><br/>`;
                    }
                });

                return tooltip;
            },
        },
        series: [
            {
                type: "column",
                name: "O₃",
                data: chartData.o3Data,
                color: "var(--ma-chart-color-app-rating-3)",
            },
            {
                type: "column",
                name: "CO",
                data: chartData.coData,
                color: "var(--ma-chart-color-app-rating-2)",
            },
            {
                type: "column",
                name: "SO₂",
                data: chartData.so2Data,
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
        v-if="!props.dates || props.dates.length === 0"
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
