import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Example for Unsplash
        port: '',
        pathname: '/**',
      }
    ],
  },
  // experimental: {
  //   taint: true, // Enable experimental taint mode for security with useOptimistic, useFormStatus
  // } // Removed as it causes build issues with current Next.js/Genkit versions
};

export default nextConfig;
