/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  webpack: config => {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
}

export default nextConfig
