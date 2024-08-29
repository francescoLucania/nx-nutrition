const {
  withNativeFederation,
  shareAll,
} = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'frontend-profile',

  exposes: {
    './Component': './apps/frontend-profile/src/app/app.component.ts',

    './routes': './apps/frontend-profile/src/app/app.routes.ts',
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto',
    }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    'bcrypt',
    'bcryptjs',
    'http',
    'axios',
    'crypto',
    'jsonwebtoken',
    'nodemailer',
    'mongoose',
    '@nestjs',
    'nestjs-form-data',
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0
});
