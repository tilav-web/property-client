import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

interface CountryMeta {
  lang: string;
  name: string;
  title: string;
  description: string;
  url: string;
  image: string;
}

const COUNTRY_META: Record<"UZ" | "MY", CountryMeta> = {
  UZ: {
    lang: "uz",
    name: "Uybos",
    title: "Uybos | Kvartira sotish va ijaraga olish — O'zbekiston",
    description:
      "Uybos — O'zbekiston bo'ylab kvartira sotish va ijaraga olish. Ishonchli e'lonlar, AI yordamida qidiruv, xaritada ko'rish.",
    url: "https://uybos.uz",
    image: "https://uybos.uz/images/hero/home-hero-1600.webp",
  },
  MY: {
    lang: "en",
    name: "Amaar Properties",
    title: "Amaar Properties | Apartments for Sale and Rent in Malaysia",
    description:
      "Amaar Properties helps you discover apartments for sale and rent across Malaysia. Trusted sellers, AI-powered search, map view.",
    url: "https://amaarproperties.com",
    image: "https://amaarproperties.com/images/hero/home-hero-1600.webp",
  },
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Default — MY (asosiy bozor). UZ build .env'da VITE_COUNTRY=UZ kerak.
  const country = (env.VITE_COUNTRY ?? "MY").toUpperCase() as "UZ" | "MY";
  const meta = COUNTRY_META[country] ?? COUNTRY_META.MY;

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "country-html-meta",
        transformIndexHtml(html: string) {
          return html
            .replaceAll("%HTML_LANG%", meta.lang)
            .replaceAll("%SITE_NAME%", meta.name)
            .replaceAll("%SITE_TITLE%", meta.title)
            .replaceAll("%SITE_DESC%", meta.description)
            .replaceAll("%SITE_URL%", meta.url)
            .replaceAll("%SITE_IMAGE%", meta.image);
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
