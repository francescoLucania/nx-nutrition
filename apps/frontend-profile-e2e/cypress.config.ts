import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run frontend-profile:serve:development',
        production: 'nx run frontend-profile:serve:production',
      },
      ciWebServerCommand: 'nx run frontend-profile:serve-static',
    }),
    baseUrl: 'http://localhost:4200',
  },
});
