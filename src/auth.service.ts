import { AuthEvent } from './auth-events.enum';
import auth0, {
  Auth0ParseHashError,
  Auth0DecodedHash,
  AuthOptions,
  WebAuth,
  AuthorizeOptions,
} from 'auth0-js';
import { IAuthService } from './auth-service.interface';
import { Subscription } from './subscription';
import { Subject } from './subject';

export enum AuthStoageKeys {
  ACCESS_TOKEN = 'accessToken',
  ID_TOKEN = 'idToken',
  EXPIRATION_DATE = 'expirationDate',
  AUTH_FULL_INFO = 'fullInfo',
}

export class AuthServiceClass implements IAuthService {
  private authNotifier = new Subject<AuthEvent>();
  private auth0: WebAuth;
  private initialized = false;
  private webStorage: Storage = localStorage;
  private authSessionInfo: Auth0DecodedHash | null = null;

  constructor(authOptions: AuthOptions) {
    this.login = this.login.bind(this);
    this.setSession = this.setSession.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.auth0 = new auth0.WebAuth({
      domain: authOptions.domain,
      clientID: authOptions.clientID,
      redirectUri: authOptions.redirectUri,
      responseType: 'token id_token',
      scope: 'openid',
    });
  }

  public init(webStorage: Storage) {
    this.webStorage = webStorage;
    if (!this.initialized) {
      const authSessionFromStor = this.webStorage.getItem(AuthStoageKeys.AUTH_FULL_INFO);
      if (authSessionFromStor) {
        this.authSessionInfo = JSON.parse(authSessionFromStor);
      }
    }
    this.initialized = true;
  }

  public login(options?: AuthorizeOptions) {
    this.isInitializedAssert();
    this.auth0.authorize(options);
  }

  public logout() {
    this.isInitializedAssert();
    // Clear access token and ID token from local storage
    this.webStorage.removeItem(AuthStoageKeys.ACCESS_TOKEN.toString());
    this.webStorage.removeItem(AuthStoageKeys.ID_TOKEN.toString());
    this.webStorage.removeItem(AuthStoageKeys.EXPIRATION_DATE.toString());

    this.authNotifier.next(AuthEvent.AUTH_CHANGE);
  }

  public isAuthenticated(): boolean {
    this.isInitializedAssert();
    // Check whether the current time is past the
    // access token's expiry time
    const expirationDate = parseInt(
      this.webStorage.getItem(AuthStoageKeys.EXPIRATION_DATE.toString()) || '',
      10,
    );
    if (expirationDate > 0) {
      return Date.now() < expirationDate;
    }

    return Boolean(
      this.webStorage.getItem(AuthStoageKeys.ACCESS_TOKEN.toString()),
    );
  }

  public subscribeOnAuthEvents(fn: (event: AuthEvent) => void): Subscription {
    return this.authNotifier.subscribe(fn);
  }

  public handleAuthentication() {
    this.auth0.parseHash(
      (
        err: Auth0ParseHashError | null,
        authResult: Auth0DecodedHash | null,
      ) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
        } else if (err) {
          // auth falied
          this.authNotifier.next(AuthEvent.AUTH_CHANGE);
        }
      },
    );
  }

  public get userSessionInfo(): Auth0DecodedHash | null {
    return this.authSessionInfo;
  }

  private isInitializedAssert() {
    if (!this.initialized) {
      throw new Error(
        'auth service is not initialized, you must call init first',
      );
    }
  }

  private setSession(authResult: Auth0DecodedHash) {
    this.authSessionInfo = authResult;
    this.webStorage.setItem(AuthStoageKeys.AUTH_FULL_INFO, JSON.stringify(this.authSessionInfo));
    if (authResult.expiresIn) {
      const expirationDate = authResult.expiresIn * 1000 + Date.now();
      this.webStorage.setItem(
        AuthStoageKeys.EXPIRATION_DATE.toString(),
        expirationDate.toString(),
      );
    }
    this.webStorage.setItem(
      AuthStoageKeys.ACCESS_TOKEN.toString(),
      authResult.accessToken || '',
    );
    this.webStorage.setItem(
      AuthStoageKeys.ID_TOKEN.toString(),
      authResult.idToken || '',
    );
    this.authNotifier.next(AuthEvent.AUTH_CHANGE);
  }
}
