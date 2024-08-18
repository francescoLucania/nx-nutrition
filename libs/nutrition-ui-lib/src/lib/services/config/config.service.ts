import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Config } from '../../models';


export const CONFIG = new InjectionToken<Config>(
  'config'
);


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public get config(): Config {
    return this.appConfig;
  }

  constructor(
    @Optional() @Inject(CONFIG) private appConfig: Config,
  ) {

    if (!this.appConfig) {
      this.appConfig = {
        production: false,
        apiUrl: 'http://localhost:5000/api',
      }
    }
  }
}
