import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Полностью статический сайт: `npm run build` → папка out/, которую можно залить на любой хостинг
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Если сайт будет жить в подпапке (например, GitHub Pages: /conference), раскомментируйте:
  // basePath: "/conference",
};

export default nextConfig;
