/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mui/x-date-pickers'],
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}'
    }
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig; 