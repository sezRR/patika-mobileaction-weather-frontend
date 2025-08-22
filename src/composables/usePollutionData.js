import { ref } from "vue";

const API_BASE_URL = "http://localhost:8080/api/v1";

export function usePollutionData() {
    const pollutionData = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchPollutionData = async (city, startDate, endDate) => {
        loading.value = true;
        error.value = null;
        try {
            const url = `${API_BASE_URL}/pollutions/history?city=${city}&start=${startDate}&end=${endDate}&page=0&size=90`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const result = await response.json();
            if (result.success) {
                pollutionData.value = result.data;
            } else {
                throw new Error("API request was not successful");
            }
        } catch (e) {
            error.value = e;
            pollutionData.value = [];
        } finally {
            loading.value = false;
        }
    };

    return {
        pollutionData,
        loading,
        error,
        fetchPollutionData,
    };
}
