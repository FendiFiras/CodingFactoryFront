// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: false, // Assurez-vous que c'est `false` en mode dev
  stripePublicKey: 'pk_test_51Qyg1ZFw4u2RN3QJSDZJNQ9K1xMJjX9RAMm0RMbE5zyXPIkvmvJZkrzMxZL6GWwzEmZenodnMPy7gZnqsyWkHc0a00Qs2OyReq' // 🔥 Ajoute ta clé ici
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
