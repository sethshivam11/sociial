/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dv3qbj0bn/**",
      },
      {
        protocol: "https",
        hostname: "maps.gomaps.pro",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
      {
        source: "/auth/google/:path*",
        destination: `${process.env.BACKEND_URL}/auth/google/:path*`
      },
      {
        source: "/socket.io/:path*",
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
    ];
  },
  reactStrictMode: false,
};

export default nextConfig;
