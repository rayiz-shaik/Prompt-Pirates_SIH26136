import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { gov: { DEFAULT: "#17324d", dark: "#0f2438" } } } },
  plugins: [],
};
export default config;
