import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        xl: "var(--radius)",   // shadcn/ui 推荐的圆角变量
      },
    },
  },

  plugins: [],
};

export default config;
