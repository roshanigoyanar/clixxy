import type { NextConfig } from "next";

const nextConfig: NextConfig = {
output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  // Proxy Supabase requests through Vercel to bypass ISP blocks (like Jio in India)
  async rewrites() {
    const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Avoid failing build if env vars are not configured on the deployment target yet.
    if (!rawSupabaseUrl) {
      console.warn(
        "NEXT_PUBLIC_SUPABASE_URL is not set. Skipping /api/supabase rewrite."
      );
      return [];
    }

    let normalizedSupabaseUrl: string;
    try {
      const parsed = new URL(rawSupabaseUrl);
      normalizedSupabaseUrl = parsed.toString().replace(/\/$/, "");
    } catch {
      console.warn(
        "NEXT_PUBLIC_SUPABASE_URL is invalid. Skipping /api/supabase rewrite."
      );
      return [];
    }

    return [
      {
        source: "/api/supabase/:path*",
        destination: `${normalizedSupabaseUrl}/:path*`,
      },
    ];
  },
};



export default nextConfig;
