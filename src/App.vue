<script setup>
import {
    MaDatePicker2,
    MaRadioGroup,
    MaCountryRadio,
    MaButton,
} from "@mobileaction/action-kit";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import "dayjs/locale/tr";
import "dayjs/locale/fr";
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

import MaBackendStatusBadge from "./components/MaBackendStatusBadge.vue";
import MaFilter from "./components/ma-filter/MaFilter.vue";
import MaFilterContainer from "./components/ma-filter/MaFilterContainer.vue";
import MaLogo from "./components/MaLogo.vue";
import MobileActionLogoSvg from "@/assets/mobileaction-logo.svg";
import PatikaLogoSvg from "@/assets/patika-logo.svg";
import MaCustomCityRadio from "./components/MaCustomCityRadio.vue";
import Barcelona from "@/assets/maps/barcelona.webp";
import London from "@/assets/maps/london.webp";
import Ankara from "@/assets/maps/ankara.webp";
import Mumbai from "@/assets/maps/mumbai.webp";
import Tokyo from "@/assets/maps/tokyo.webp";
import MaCustomChart from "./components/chart/MaCustomChart.vue";
import MaAlertContainer from "./components/MaAlertContainer.vue";
import { usePollutionData } from "@/composables/usePollutionData";
import { useBackendHealth } from "@/composables/useBackendHealth";

const { t, locale, d } = useI18n();
const {
    pollutionData,
    loading,
    error,
    fetchPollutionData,
    clearPollutionData,
} = usePollutionData();
const { isOnline: backendIsOnline } = useBackendHealth();

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

watch(locale, (newLocale) => {
    dayjs.locale(newLocale);
    let cookieValue = newLocale;
    document.cookie = `PATIKA_MA_WEATHER_LOCALE=${cookieValue};path=/;max-age=31536000`;
});

const dateRange = ref([
    dayjs().subtract(1, "week").format("YYYY-MM-DD"),
    dayjs().subtract(1, "day").format("YYYY-MM-DD"),
]);

const selectedCity = ref("ankara");

// Store the current selected dates from the filter
const currentSelectedDates = ref([]);
const isInitialLoad = ref(true);

watch(
    [selectedCity, dateRange],
    async () => {
        if (dateRange.value.length === 2) {
            // Store the current selected dates before clearing
            const previouslySelectedDates = [...currentSelectedDates.value];

            // Clear existing data cache when city or date range changes
            clearPollutionData();
            isInitialLoad.value = true;

            // Always fetch the full date range data first
            await fetchPollutionData(
                selectedCity.value,
                dayjs(dateRange.value[0]).format("YYYY-MM-DD"),
                dayjs(dateRange.value[1]).format("YYYY-MM-DD"),
                null // Don't use selected dates for initial load
            );

            // If there were previously selected dates, validate them against the new range and fetch additional data if needed
            if (previouslySelectedDates.length > 0) {
                const startDate = dayjs(dateRange.value[0]);
                const endDate = dayjs(dateRange.value[1]);
                const validSelectedDates = previouslySelectedDates.filter(
                    (date) => {
                        const dateObj = dayjs(date);
                        return (
                            dateObj.isSameOrAfter(startDate) &&
                            dateObj.isSameOrBefore(endDate)
                        );
                    }
                );

                if (validSelectedDates.length > 0) {
                    // Restore the valid selected dates
                    currentSelectedDates.value = validSelectedDates;
                    // Fetch additional data for these specific dates
                    await fetchPollutionData(
                        selectedCity.value,
                        dayjs(dateRange.value[0]).format("YYYY-MM-DD"),
                        dayjs(dateRange.value[1]).format("YYYY-MM-DD"),
                        validSelectedDates
                    );
                }
            }

            isInitialLoad.value = false;
        }
    },
    { immediate: true }
);

// Watch for changes in selected filter dates and refetch data
watch(
    () => currentSelectedDates.value,
    (newSelectedDates) => {
        // Only trigger API call if it's not the initial load and we have selected dates
        // and this change is from user interaction (not from city change)
        if (
            !isInitialLoad.value &&
            dateRange.value.length === 2 &&
            newSelectedDates.length > 0
        ) {
            fetchPollutionData(
                selectedCity.value,
                dayjs(dateRange.value[0]).format("YYYY-MM-DD"),
                dayjs(dateRange.value[1]).format("YYYY-MM-DD"),
                newSelectedDates
            );
        }
    },
    { deep: true }
);

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

const filteredDates = ref([]);

// Create separate arrays for cache vs display
const chartDisplayData = computed(() => {
    if (filteredDates.value.length === 0) {
        // If no dates are selected in filter, show no data
        return [];
    }

    // Filter the cached pollution data to only include selected dates
    return pollutionData.value.filter((item) =>
        filteredDates.value.includes(item.date)
    );
});

watch(
    daysInRange,
    (newDays) => {
        filteredDates.value = [...newDays];
    },
    { immediate: true }
);

const handleSelectionChange = (newSelectedDates) => {
    // Sort dates descendingly to ensure chart is always ordered correctly
    filteredDates.value = newSelectedDates.sort((a, b) =>
        dayjs(b).diff(dayjs(a))
    );
    currentSelectedDates.value = newSelectedDates;
    isInitialLoad.value = false; // Mark that we're no longer in initial load state
};
</script>

<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center gap-4 px-6"
    >
        <MaAlertContainer />
        <div
            class="flex flex-col px-8 justify-between items-center gap-4 h-screen py-4"
        >
            <div className="grid grid-cols-5 grid-rows-1 gap-4">
                <div className="col-span-2 relative">
                    <MaLogo
                        placement="top-right"
                        :src="MobileActionLogoSvg"
                        alt="Mobile Action Logo"
                        class="w-44"
                    />
                </div>
                <div className="flex flex-col gap-2 col-start-3">
                    <MaBackendStatusBadge :isOnline="backendIsOnline" />
                    <div class="flex flex-col gap-1">
                        <MaDatePicker2
                            v-model="dateRange"
                            :range="true"
                            :multiCalendars="true"
                            :placeholder="`${t('start_date')} – ${t(
                                'end_date'
                            )}`"
                            valueFormat="YYYY-MM-DD"
                            :teleport="false"
                        />
                    </div>
                    <div class="flex gap-2 justify-center items-center flex-1">
                        <MaCountryRadio
                            name="country"
                            :country="country"
                            :key="country"
                            v-model:value="locale"
                            v-for="country in ['tr', 'gb', 'fr']"
                        />
                    </div>
                </div>
                <div className="col-span-2 col-start-4 wrap relative">
                    <MaLogo
                        placement="top-left"
                        :src="PatikaLogoSvg"
                        alt="Patika Logo"
                        class="w-32"
                    />
                </div>
            </div>

            <MaRadioGroup v-model:value="selectedCity">
                <MaCustomCityRadio
                    :city="t('barcelona')"
                    :country="t('spain')"
                    :map="Barcelona"
                    alt="City Map of Barcelona"
                    value="barcelona"
                />
                <MaCustomCityRadio
                    :city="t('london')"
                    :country="t('united_kingdom')"
                    :map="London"
                    alt="City Map of London"
                    value="london"
                />
                <MaCustomCityRadio
                    :city="t('ankara')"
                    :country="t('turkey')"
                    :map="Ankara"
                    alt="City Map of Ankara"
                    selected="true"
                    value="ankara"
                />
                <MaCustomCityRadio
                    :city="t('mumbai')"
                    :country="t('india')"
                    :map="Mumbai"
                    alt="City Map of Mumbai"
                    value="mumbai"
                />
                <MaCustomCityRadio
                    :city="t('tokyo')"
                    :country="t('japan')"
                    :map="Tokyo"
                    alt="City Map of Tokyo"
                    value="tokyo"
                />
            </MaRadioGroup>
            <div class="flex flex-col gap-2 justify-center items-center flex-1">
                <MaCustomChart
                    :dates="filteredDates"
                    :pollutionData="chartDisplayData"
                    :loading="loading"
                    :error="error"
                />
            </div>
            <MaFilterContainer @selection-change="handleSelectionChange">
                <MaFilter v-for="day in daysInRange" :key="day" :date="day">
                    {{ d(day, "short") }}
                </MaFilter>
            </MaFilterContainer>
        </div>
    </div>
</template>
