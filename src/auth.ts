import axios from 'axios';
import {loginUrl, logoutUrl} from './endpoints';

export class Auth {
  static get token() {
    return Auth._token;
  }

  public static set useLocalStorage(using: boolean) {
    if (window != undefined && window.localStorage != undefined) {
      Auth._useLocalStorage = using;
    }
  }

  public static get useLocalStorage(): boolean {
    return Auth._useLocalStorage;
  }

  public static clearLocalStorage() {
    if (window != undefined && window.localStorage != undefined) {
      window.localStorage.removeItem(Auth.key);
      if (Auth._useLocalStorage) {
        Auth._useLocalStorage = false;
      }
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

  private static key = 'alphaseekToken';
  private static _token: string;
  private static _useLocalStorage: boolean = false;
  private static clearToken() {
    if (Auth.useLocalStorage) {
      window.localStorage.removeItem(Auth.key);
    } else {
      Auth._token = '';
    }
  }
  private static setToken(tok: string) {
    const token = tok.trim();
    if (Auth.useLocalStorage) {
      window.localStorage.setItem(Auth.key, token);
    } else {
      Auth._token = token;
    }
  }
}
