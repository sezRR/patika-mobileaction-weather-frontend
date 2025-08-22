import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import tr from "./locales/tr.json";
import fr from "./locales/fr.json";

const getLocale = () => {
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("PATIKA_MA_WEATHER_LOCALE="))
        ?.split("=")[1];

    if (cookieValue === "gb") return "en";
    return cookieValue || navigator.language.split("-")[0] || "en";
};

const i18n = createI18n({
    legacy: false,
    locale: getLocale(),
    fallbackLocale: "en",
    messages: {
        en,
        tr,
        fr,
    },
});

export default i18n;
