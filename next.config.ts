import type { Configuration } from 'webpack'

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  webpack: (config: Configuration) => {
    if (!config.module) config.module = { rules: [] }
    if (!config.module.rules) config.module.rules = []
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
}

export default nextConfig
