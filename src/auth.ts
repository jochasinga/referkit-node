import axios from 'axios';
import {loginUrl, logoutUrl} from './endpoints';

export class Auth {
  static get token() {
    if (window && window.localStorage) {
      return window.localStorage.getItem(Auth.key);
    }
    // return Auth._token;
  }

  public static hasCurrent(): boolean {
    return Auth._current !== undefined;
  }

  static get current(): Auth {
    return Auth._current;
  }

  // public static set useLocalStorage(using: boolean) {
  //   if (window != undefined && window.localStorage != undefined) {
  //     Auth._useLocalStorage = using;
  //   }
  // }

  // public static get useLocalStorage(): boolean {
  //   return Auth._useLocalStorage;
  // }

  public static clearLocalStorage() {
    if (window != undefined && window.localStorage != undefined) {
      window.localStorage.removeItem(Auth.key);
      // if (Auth._useLocalStorage) {
      //   Auth._useLocalStorage = false;
      // }
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

  private static key = 'alphaseekToken';
  // private static _token: string;
  // private static _useLocalStorage: boolean = false;
  private static clearToken() {
    // if (Auth.useLocalStorage) {
    //   window.localStorage.removeItem(Auth.key);
    // } else {
    //   Auth._token = '';
    // }
    if (window && window.localStorage) {
      window.localStorage.removeItem(Auth.key);
    }
  }
  private static setToken(tok: string) {
    // const token = tok.trim();
    // if (Auth.useLocalStorage) {
    //   window.localStorage.setItem(Auth.key, token);
    // } else {
    //   Auth._token = token;
    // }
    if (window && window.localStorage) {
      window.localStorage.setItem(Auth.key, tok.trim());
    }
  }

  private static _current: Auth;
  private _token: string = '';
}
