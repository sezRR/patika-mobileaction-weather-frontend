import { ref } from "vue";

const alerts = ref([]);
let idCounter = 0;

export function useAlerts() {
    const addAlert = (options) => {
        const id = idCounter++;
        const duration = options.duration || 3000;

        alerts.value.unshift({ id, ...options });

        setTimeout(() => {
            removeAlert(id);
        }, duration);
    };

    const removeAlert = (id) => {
        const index = alerts.value.findIndex((alert) => alert.id === id);
        if (index !== -1) {
            alerts.value.splice(index, 1);
        }
    };

    return {
        alerts,
        addAlert,
        removeAlert,
    };
}
