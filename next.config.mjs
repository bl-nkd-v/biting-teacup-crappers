/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["bitcoin-core", "bunyan", "debugnyan"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        path: false,
        os: false,
      };
    }
    if (isServer) {
      config.externals = [
        ...config.externals,
        "bitcoin-core",
        "path",
        "os",
        "fs",
        "crypto",
        "child_process",
      ];
    }
    return config;
  },
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
