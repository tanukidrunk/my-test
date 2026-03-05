import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // เพิ่มบรรทัดนี้เพื่อลดขนาด Image มหาศาล
  output: 'standalone', 
};

export default nextConfig;