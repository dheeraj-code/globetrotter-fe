import { makeAutoObservable, runInAction } from 'mobx';
import { authService } from '../Services/auth';

class AuthStore {
  error = null;
  loading = false;
  isAuthenticated = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.checkAuthStatus();
  }

  async login(email, password) {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      const success = await authService.login(email, password);
      
      runInAction(() => {
        if (success) {
          this.isAuthenticated = true;
        }
      });

      return success;
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.isAuthenticated = false;
      });
      return false;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  logout() {
    authService.logout();
    runInAction(() => {
      this.isAuthenticated = false;
    });
  }

  checkAuthStatus() {
    const isAuth = authService.isAuthenticated();
    runInAction(() => {
      this.isAuthenticated = isAuth;
    });
  }
}

export const authStore = new AuthStore(); 