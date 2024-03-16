import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mydrbg: "#272727",
        mydrlogocolour: "#54938E",
        lightpurple: "#7A83B2",
        usermessage: "#D5D9DF",
        botmessage: "#54938E"

      },
    },
  },
  plugins: [],
};
export default config;
