import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async redirects() {
    return [
      /* Đường dẫn nhà gái cũ — giữ cho các link đã lỡ gửi đi. */
      { source: "/nha-gai", destination: "/T", permanent: true },
    ];
  },
};

export default nextConfig;
