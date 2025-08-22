import { createI18n } from "vue-i18n";
import gb from "./locales/gb.json";
import tr from "./locales/tr.json";
import fr from "./locales/fr.json";

const getLocale = () => {
    const cookieName = "PATIKA_MA_WEATHER_LOCALE";
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${cookieName}=`))
        ?.split("=")[1];

    if (cookieValue) {
        return cookieValue;
    }

    document.cookie = `${cookieName}=gb;path=/;max-age=31536000`;
    return "gb";
};

const i18n = createI18n({
    legacy: false,
    locale: getLocale(),
    fallbackLocale: "gb",
    messages: {
        gb,
        tr,
        fr,
    },
});

export default i18n;
