/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  swcMinify: true,
  
  webpack: (config, { dev, isServer }) => {
    // プロダクション環境の最適化
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          minSize: 10000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                return `npm.${packageName.replace('@', '')}`;
              },
            },
            commons: {
              test: /[\\/]components[\\/]/,
              name: 'commons',
              minChunks: 2,
              priority: -20,
            },
            mui: {
              test: /[\\/]node_modules[\\/](@mui|@emotion)/,
              name: 'mui',
              chunks: 'all',
              priority: 30,
            },
          },
        },
        runtimeChunk: {
          name: 'runtime',
        },
        minimize: true,
        minimizer: [
          '...',
          new config.optimization.minimizer[0]({
            parallel: true,
          }),
        ],
      };

      // Tree Shakingの強化
      config.optimization.usedExports = true;
      config.optimization.sideEffects = true;
    }

    // 共通のキャッシュ設定
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
      maxAge: 7 * 24 * 60 * 60 * 1000,
      compression: 'gzip',
    };

    return config;
  },

  // 画像最適化の設定
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    minimumCacheTTL: 60,
  },

  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    workerThreads: true,
    optimizeServerReact: true,
    turbotrace: {
      logLevel: 'error',
      logDetail: true,
      memoryLimit: 4096,
    },
    serverComponentsExternalPackages: ['@mui/material'],
  },

  transpilePackages: [
    '@mui/x-date-pickers',
    '@mui/material',
    '@emotion/react',
    '@emotion/styled',
    'date-fns'
  ],
};

module.exports = nextConfig; 