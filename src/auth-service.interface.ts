import { Subscription } from './subscription';
import { AuthEvent } from './auth-events.enum';

export abstract class IAuthService {
  public abstract login: () => void;
  public abstract logout: () => void;
  public abstract isAuthenticated: () => boolean;
  public abstract subscribeOnAuthEvents: (fn: (event: AuthEvent) => void) => Subscription;
  public abstract init: (webStorage: Storage) => void;
  public abstract handleAuthentication: () => void;
}
