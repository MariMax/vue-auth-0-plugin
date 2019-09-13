import {Subscription} from './subscription';
import {AuthEvent} from './auth-events.enum';
import {IAuthService} from './auth-service.interface';

import Vue, {PluginFunction} from 'vue';
import {AuthServiceClass} from './auth.service';

export interface IAuthServiceOptions {
  domain: string;
  clientID: string;
  redirectUri: string;
}

const defulatOptions = {
  domain: '',
  clientID: '',
  redirectUri: '',
};

export const AuthService: PluginFunction<IAuthServiceOptions> = (
  V: typeof Vue,
  options: IAuthServiceOptions = defulatOptions,
) => {
  const {domain, clientID, redirectUri} = options;
  const instance = new AuthServiceClass({
    domain,
    clientID,
    redirectUri,
  });

  V.prototype.$authService = instance;
};

export {AuthEvent, IAuthService, Subscription};
