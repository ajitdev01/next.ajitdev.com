import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Google profile photos (OAuth avatar)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        // GitHub avatars (future-proof)
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        // Atlas Store – Fake Store API product images
        protocol: "https",
        hostname: "fakestoreapi.com",
        pathname: "/img/**",
      },
      {
        // Atlas Store – DummyJSON CDN product images
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/product-images/**",
      },
      {
        // Unsplash CDN images
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        // Unsplash direct
        protocol: "https",
        hostname: "unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
