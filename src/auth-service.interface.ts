import { Subscription } from './subscription';
import { Auth0DecodedHash, AuthorizeOptions } from 'auth0-js';

export abstract class IAuthService {
  public abstract login: (options?: AuthorizeOptions) => void;
  public abstract logout: () => void;
  public abstract isAuthenticated: () => boolean;
  public abstract subscribeOnAuthEvents: (fn: (event: Auth0DecodedHash | null) => void) => Subscription;
  public abstract init: (webStorage: Storage) => void;
  public abstract handleAuthentication: () => void;
  public abstract readonly userSessionInfo: Auth0DecodedHash | null;
}
