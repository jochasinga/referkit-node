import axios from 'axios';
import {loginUrl, logoutUrl, meUrl} from './endpoints';
import {Customer} from './customer';

export class Auth {
  static get token() {
    return (window && window.localStorage)
      ? window.localStorage.getItem(Auth.key)
      : Auth._token;
  }

  public static hasCurrent(): boolean {
    return Auth._current !== undefined;
  }

  static get current(): Auth {
    return Auth._current;
  }

  public static clearLocalStorage() {
    if (window != undefined && window.localStorage != undefined) {
      window.localStorage.removeItem(Auth.key);
    }
  }

  public static async login(emailAddress: string, password: string): Promise<string> {
    try {
      const res = await axios.post(loginUrl, {emailAddress, password})
      const {token} = res.data;
      Auth.setToken(token);
      return token;
    } catch (err) {
      return err;
    }
  }

  public static async logout(): Promise<boolean> {
    try {
      const res = await axios.post(logoutUrl, {
        headers: {
          'Authorization': `Bearer ${Auth.token}`,
        }
      });
      const {success} = res.data;
      Auth.clearToken();
      return success;
    } catch (err) {
      return err;
    }
  }

  public static async me(): Promise<Customer> {
    try {
      const res = await axios.get(meUrl, {
        headers: {
          'Authorization': `Bearer ${Auth.token}`,
        }
      });
      const {me} = res.data;
      return me as Customer;
    } catch (err) {
      return err;
    }
  }

  constructor() {
    if (Auth.hasCurrent()) {
      Auth._current.logout();
    }
    Auth._current = this;
  }

  public get isLoggedIn(): boolean {
    return this._token !== '';
  }

  public get token(): string {
    return this._token;
  }

  public async login(emailAddress: string, password: string): Promise<string> {
    try {
      const res = await axios.post(loginUrl, {emailAddress, password})
      const {token} = res.data;
      this._token = token;
      return token;
    } catch (err) {
      return err;
    }
  }

  public async logout(): Promise<boolean> {
    try {
      const res = await axios.post(logoutUrl, {
        headers: {
          'Authorization': `Bearer ${this._token}`,
        }
      });
      const {success} = res.data;
      this._token = '';
      return success;
    } catch (err) {
      return err;
    }
  }

  public async me(): Promise<Customer> {
    try {
      const res = await axios.get(meUrl, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        }
      });
      const {me} = res.data;
      return me as Customer;
    } catch (err) {
      return err;
    }
  }

  private static key = 'alphaseekToken';
  private static clearToken() {
    if (window && window.localStorage) {
      window.localStorage.removeItem(Auth.key);
    }
    Auth._token = '';
  }
  private static setToken(tok: string) {
    if (window && window.localStorage) {
      window.localStorage.setItem(Auth.key, tok.trim());
    }
    Auth._token = tok;
  }

  private static _token: string;
  private static _current: Auth;
  private _token: string = '';
}
