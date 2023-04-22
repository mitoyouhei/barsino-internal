import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { langs } from "./langs";
export const initI18next = () => {
  return i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources: langs,
      fallbackLng: "en",
      detection: {
        // keys or params to lookup language from
        lookupQuerystring: "lang",
        lookupCookie: "barsinoLang",
        lookupLocalStorage: "barsinoLang",
        lookupSessionStorage: "barsinoLang",
      },
    })
};
