import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true, // `true` en mode production
  stripePublicKey: 'pk_test_51Qyg1ZFw4u2RN3QJSDZJNQ9K1xMJjX9RAMm0RMbE5zyXPIkvmvJZkrzMxZL6GWwzEmZenodnMPy7gZnqsyWkHc0a00Qs2OyReq' // 🔥 Clé de production
};
