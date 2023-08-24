/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ecommerce-admin-kpirabaharan-billboards.s3.amazonaws.com',
      'ecommerce-admin-kpirabaharan-products.s3.amazonaws.com',
    ],
  },
};

module.exports = nextConfig;
