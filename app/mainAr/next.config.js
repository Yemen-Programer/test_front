/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // ⛔ تجاهل أخطاء TS أثناء build
  },
};

module.exports = nextConfig;
