import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', "sans-serif"],
      },
      screens: { "3xl": "2000px" },
      boxShadow: {
        "tour-divider-shadow": "0px 1px 0px rgba(255, 255, 255, 0.12)",
        "gradient-blur":
          "0 0 10px 0 rgba(34, 224, 250, 0.5), 0 0 20px 0 rgba(130, 16, 170, 0.3)",
      },
      animation: {
        "subtle-float-3": "subtle-float-3 3s ease-in-out infinite",
        "subtle-float-2": "subtle-float-2 4s ease-in-out infinite",
        "subtle-float-1": "subtle-float-1 3.5s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-in-out forwards",
      },
      keyframes: {
        "subtle-float-3": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "subtle-float-2": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "subtle-float-1": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-11px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      borderRadius: {
        "3": "3px",
        "7": "7px",
      },
      backgroundImage: {
        "home-purple-trail":
          "linear-gradient(180deg, #627EEA 0%, rgba(98, 126, 234, 0) 100%)",
        "tour-popup": "linear-gradient(180deg, #2E3146 0%, #20222F 100%)",
        "home-blue-trail":
          "linear-gradient(180deg, #2775CA 0%, rgba(39, 117, 202, 0) 100%)",
        "home-main": 'url("app/assets/home/home-main-bg.png")',
        "referral-bg": 'url("app/assets/referrals/referral-bg.png")',
        "green-button": "linear-gradient(180deg, #30E0A1 0%, #118159 100%)",
        "green-button-hover": "linear-gradient(0deg, #30E0A1 0%, #118159 100%)",
        "p3-button": "linear-gradient(180deg, #F05722 0%, #B03E17 100%)",
        "disabled-button": "linear-gradient(180deg, #282F39 0%, #1F242B 100%)",
        "p3-button-hover": "linear-gradient(0deg, #F05722 0%, #B03E17 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "card-grad": "linear-gradient(180deg, #1A1C2A 0%, #0C0C0F 100%)",
        "white-card-grad": "linear-gradient(180deg, #F5F5F5 0%, #B1B1B1 100%)",
        "reverse-card-grad":
          "linear-gradient(180deg, #0C0C0F 0%, #1A1C2A 100%)",
        "button-grad": "linear-gradient(180deg, #F05722 0%, #963718 100%)",
        "button-grad-hover":
          "linear-gradient(180deg, #F05722 0%, #F05722 100%)",
        "light-orange-grad": "linear-gradient(90deg, #F05722 0%, #F18522 100%)",
        "input-grad": "linear-gradient(180deg, #2E3146 0%, #20222F 100%)",
        "green-grad": "linear-gradient(180deg, #30E0A1 0%, #27A379 100%)",
        slider: "linear-gradient(270.04deg, #30E0A1 0%, #118159 99.97%)",
        "green-grad-hover": "linear-gradient(180deg, #27A379 0%, #30E0A1 100%)",
        "red-grad": "linear-gradient(180deg, #FA2256 0%, #AA1035 100%)",
        "red-grad-hover": "linear-gradient(180deg, #AA1035 0%, #FA2256 100%)",
        "secondary-banner": "url('/img/common/airdrop-bg.png')",
        "dropdown-grad": "linear-gradient(180deg, #2E3146 0%, #20222F 100%)",
        "futuristic-overlay": "url('/img/earn/futuristic-hero-overlay.png')",
        "home-card-grad":
          "linear-gradient(180deg, rgba(26, 28, 42, 0.3) 0%, rgba(12, 12, 15, 0.3) 100%)",
        "modal-gradient":
          "radial-gradient(circle at top left, #22E0FA, #8210AA)",
        "bg-home-card-grad": "url('/img/home/home-bg-gradient.png')",
        "printer-orange-gradient":
          "linear-gradient(to bottom, #F05722 0%, #F05722 65%, #F18522 100%)",
      },
      colors: {
        "tour-divider": "#1A1B24",
        p3: "#F05722",
        "p3-border": "#F05722",
        loading: "#5D6588",
        secondary: "#2D2D2D",
        "table-header": "#2E3146",
        "custom-top": "#1A1C2A",
        "custom-bottom": "#0C0C0F",
        "button-bottom": "#B03E17",
        "inactive-text": "#ADADAD",
        "active-text": "#FFFFFF",
        "printer-orange": "#F05722",
        "printer-light-orange": "#F18522",
        "printer-gray": "#CACACA",
        "printer-green": "#30E0A1",
        "green-bottom": "#27A379",
        "printer-red": "#FA2256",
        "red-bottom": "#AA1035",
        "dark-text": "#181A26",
        "gray-text": "#5D6588",
        "base-gray": "#758091",
        "printer-yellow": "#DCE030",
        "input-top": "#2E3146",
        "input-bottom": " #20222F",
        "printer-dark-orange": "#963718",
        "dark-1": "#181926",
        "dark-2": "#141518",
        "table-gray": "#2D3045",
        "accordion-gray": "#2A2D40",
        "dashboard-gray": "#8E9BAE",
        "sexy-gray": "#696969",
        cardborder: "#282F39",
        cardblack: "#07080A",
        menu: "#181C23",
      },

      fontSize: {
        10: [
          "0.625rem",
          {
            lineHeight: "0.7rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        13: [
          "0.813rem",
          {
            lineHeight: "0.938rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        15: [
          "0.938rem",
          {
            lineHeight: "1.063rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        22: [
          "1.375rem",
          {
            lineHeight: "1.65rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        26: [
          "1.625rem",
          {
            lineHeight: "1.788rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        28: [
          "1.75rem",
          {
            lineHeight: "2.1rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        40: [
          "2.5rem",
          {
            lineHeight: "2.75rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        49: [
          "3.063rem",
          {
            lineHeight: "3.369rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        65: [
          "4.5rem",
          {
            lineHeight: "4.75rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        100: [
          "6.25rem",
          {
            lineHeight: "6.35rem",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        xxs: "8px",
      },
    },
  },
  plugins: [
    nextui(),
    function ({ addUtilities }: any) {
      addUtilities(
        {
          ".custom-scrollbar": {
            "scrollbar-width": "thin",
            "scrollbar-color": "#F05722 #1a1b2d",
          },
          ".custom-scrollbar::-webkit-scrollbar": {
            width: "12px",
          },
          ".custom-scrollbar::-webkit-scrollbar-track": {
            background: "#1a1b2d",
          },
          ".custom-scrollbar::-webkit-scrollbar-thumb": {
            "background-color": "#F05722",
            "border-radius": "6px",
            border: "3px solid #1a1b2d",
          },
          ".no-scrollbar": {
            "-ms-overflow-style": "none" /* IE and Edge */,
            "scrollbar-width": "none" /* Firefox */,
          },
          ".no-scrollbar::-webkit-scrollbar": {
            display: "none" /* Chrome, Safari, and Opera */,
          },
          ".gradient-blur": {
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: "-10px",
              right: "-10px",
              bottom: "-10px",
              left: "-10px",
              background: "var(--tw-gradient-stops)",
              filter: "blur(10px)",
              zIndex: "-1",
              borderRadius: "inherit",
            },
          },
          ".text-gradient": {
            "background-clip": "text",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
          },
        },
        ["responsive", "hover"]
      );
    },
  ],
};
export default config;
