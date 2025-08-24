import { ref } from "vue";
import dayjs from "dayjs";

const API_BASE_URL = "http://localhost:8080/api/v1";

export function usePollutionData() {
    const pollutionData = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const clearPollutionData = () => {
        pollutionData.value = [];
        error.value = null;
    };

    const fetchPollutionData = async (
        city,
        startDate,
        endDate,
        selectedDates = null
    ) => {
        loading.value = true;
        error.value = null;

        try {
            let allData = [];

            if (selectedDates && selectedDates.length > 0) {
                // Sort selected dates and ensure they're in proper format (ascending for interval grouping)
                const sortedDates = selectedDates
                    .map((date) => dayjs(date).format("YYYY-MM-DD")) // Normalize format
                    .sort((a, b) => dayjs(a).diff(dayjs(b))); // Sort chronologically (ascending for grouping)

                // Group consecutive dates into intervals to minimize API calls
                const dateIntervals = [];
                let currentInterval = {
                    start: sortedDates[0],
                    end: sortedDates[0],
                };

                for (let i = 1; i < sortedDates.length; i++) {
                    const currentDate = dayjs(sortedDates[i]);
                    const previousDate = dayjs(currentInterval.end);

                    // If dates are consecutive or close (within 3 days), extend the interval
                    if (currentDate.diff(previousDate, "day") <= 3) {
                        currentInterval.end = sortedDates[i];
                    } else {
                        // Start a new interval
                        dateIntervals.push(currentInterval);
                        currentInterval = {
                            start: sortedDates[i],
                            end: sortedDates[i],
                        };
                    }
                }
                dateIntervals.push(currentInterval);

                // Make API requests for each interval
                const promises = dateIntervals.map(async (interval) => {
                    // Ensure dates are in YYYY-MM-DD format and handle timezone issues
                    const startDate = dayjs(interval.start).format(
                        "YYYY-MM-DD"
                    );
                    const endDate = dayjs(interval.end).format("YYYY-MM-DD");

                    console.log(
                        `Fetching data for interval: ${startDate} to ${endDate}`
                    );

                    const url = `${API_BASE_URL}/pollutions/history?city=${city}&start=${startDate}&end=${endDate}&page=0&size=90`;
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(
                            `Network response was not ok for interval ${startDate} to ${endDate}`
                        );
                    }
                    const result = await response.json();
                    if (result.success) {
                        return result.data;
                    } else {
                        throw new Error(
                            `API request was not successful for interval ${startDate} to ${endDate}`
                        );
                    }
                });

                // Wait for all requests to complete and merge results
                const results = await Promise.all(promises);
                allData = results.flat();

                // Remove duplicates based on date and keep the latest data
                const dataMap = new Map();
                allData.forEach((item) => {
                    const existingItem = dataMap.get(item.date);
                    if (
                        !existingItem ||
                        dayjs(item.createdAt || item.updatedAt).isAfter(
                            dayjs(
                                existingItem.createdAt || existingItem.updatedAt
                            )
                        )
                    ) {
                        dataMap.set(item.date, item);
                    }
                });
                allData = Array.from(dataMap.values());
            } else {
                // If no specific dates selected, fetch the full range
                // Ensure dates are in YYYY-MM-DD format and handle timezone issues
                const formattedStartDate =
                    dayjs(startDate).format("YYYY-MM-DD");
                const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

                console.log(
                    `Fetching full range data: ${formattedStartDate} to ${formattedEndDate}`
                );

                const url = `${API_BASE_URL}/pollutions/history?city=${city}&start=${formattedStartDate}&end=${formattedEndDate}&page=0&size=90`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                if (result.success) {
                    allData = result.data;
                } else {
                    throw new Error("API request was not successful");
                }
            }

            // Merge new data with existing data, remove duplicates, and sort
            const combinedData = [...pollutionData.value, ...allData];
            const dataMap = new Map();

            combinedData.forEach((item) => {
                const existingItem = dataMap.get(item.date);
                if (
                    !existingItem ||
                    dayjs(item.createdAt || item.updatedAt).isAfter(
                        dayjs(existingItem.createdAt || existingItem.updatedAt)
                    )
                ) {
                    dataMap.set(item.date, item);
                }
            });

            pollutionData.value = Array.from(dataMap.values()).sort(
                (a, b) => dayjs(b.date).diff(dayjs(a.date)) // Sort by date descending (newest first)
            );
        } catch (e) {
            error.value = e;
            // Don't clear existing data on error, just show the error
        } finally {
            loading.value = false;
        }
    };

    return {
        pollutionData,
        loading,
        error,
        fetchPollutionData,
        clearPollutionData,
    };
}
