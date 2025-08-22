<script setup>
import {
    MaDatePicker2,
    MaRadioGroup,
    MaCountryRadio,
} from "@mobileaction/action-kit";
import dayjs from "dayjs";
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
import MaCustomChart2 from "./components/chart/MaCustomChart2.vue";

const { t, locale } = useI18n();

watch(locale, (newLocale) => {
    document.cookie = `PATIKA_MA_WEATHER_LOCALE=${newLocale};path=/;max-age=31536000`;
});

const dateRange = ref([
    dayjs().subtract(1, "week").format("YYYY-MM-DD"),
    dayjs().subtract(1, "day").format("YYYY-MM-DD"),
]);

const selectedCountry = ref("gb");
const selectedCity = ref("ankara");

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

watch(
    daysInRange,
    (newDays) => {
        filteredDates.value = [...newDays];
    },
    { immediate: true }
);

const handleSelectionChange = (newSelectedDates) => {
    filteredDates.value = newSelectedDates;
};
</script>

<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center gap-4 px-6"
    >
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
                    <MaBackendStatusBadge :isOnline="true" />
                    <div class="flex flex-col gap-1">
                        <MaDatePicker2
                            v-model="dateRange"
                            :range="true"
                            :multiCalendars="true"
                            placeholder="Start Date – End Date"
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
            <!-- https://mobileaction.github.io/action-kit/?path=/docs/advanced-machart--docs -->
            <div class="flex flex-col gap-2 justify-center items-center flex-1">
                <MaCustomChart :dates="filteredDates" />
                <!-- <MaCustomChart2 /> -->
            </div>
            <MaFilterContainer @selection-change="handleSelectionChange">
                <MaFilter v-for="day in daysInRange" :key="day" :date="day">
                    {{ day }}
                </MaFilter>
            </MaFilterContainer>
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
        </div>
    </div>
</template>
