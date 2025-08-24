import { ref, onMounted, onUnmounted } from "vue";

const API_BASE_URL = "http://localhost:8080/api/v1";

export function useBackendHealth() {
    const isOnline = ref(false);
    const isChecking = ref(false);
    let healthCheckInterval = null;

    const checkBackendHealth = async () => {
        if (isChecking.value) return;

        isChecking.value = true;
        try {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Request timeout")), 5000);
            });

            const fetchPromise = fetch(
                `${API_BASE_URL}/pollutions/history?city=ankara&start=2025-01-01&end=2025-01-01&page=0&size=1`,
                {
                    method: "GET",
                }
            );

            const response = await Promise.race([fetchPromise, timeoutPromise]);
            isOnline.value = response.ok;
        } catch (error) {
            isOnline.value = false;
        } finally {
            isChecking.value = false;
        }
    };

    const startHealthCheck = () => {
        checkBackendHealth();

        healthCheckInterval = setInterval(checkBackendHealth, 30000);
    };

    const stopHealthCheck = () => {
        if (healthCheckInterval) {
            clearInterval(healthCheckInterval);
            healthCheckInterval = null;
        }
    };

    onMounted(() => {
        startHealthCheck();
    });

    onUnmounted(() => {
        stopHealthCheck();
    });

    return {
        isOnline,
        isChecking,
        checkBackendHealth,
        startHealthCheck,
        stopHealthCheck,
    };
}
