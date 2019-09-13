import { IAuthService } from './index';
declare module 'vue/types/vue' {
  interface Vue {
    $authService: IAuthService;
  }
}
