/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dv3qbj0bn/**",
      },
      {
        protocol: "https",
        hostname: "maps.gomaps.pro",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.buymeacoffee.com",
        pathname: "/buttons/v2/default-yellow.png",
      }
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
