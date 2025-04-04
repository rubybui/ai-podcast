/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "d13pe6gzxllor5.cloudfront.net",
      "localhost:3000",
      "lh3.googleusercontent.com",
      "s3.us-west-2.amazonaws.com",
      "images.unsplash.com"
    ]
  }
};

module.exports = nextConfig;
