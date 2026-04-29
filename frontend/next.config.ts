import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images : {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8001", // important si ton backend tourne sur ce port
        pathname: "/media/**", // autorise toutes les images
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // si tu utilises Google Auth ou images Google
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },
      // AWS S3 Bucket
      {
        protocol: "https",
        hostname: "my-airbnb-clone2.s3.eu-north-1.amazonaws.com", 
        pathname: "/**"
      },
    ],
    qualities: [75, 95],
  }
};

export default nextConfig;