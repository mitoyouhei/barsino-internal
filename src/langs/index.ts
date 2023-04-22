import en from "./en.json";

export const langs: {
  [lang: string]: { translation: object; displayName: string };
} = {
  en: {
    translation: en,
    displayName: "English",
  },
};
